"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const config_1 = __importDefault(require("@/config/config"));
const jobs_1 = require("@/utils/jobs");
const bullmq_1 = require("bullmq");
const log4js_1 = require("log4js");
const payment_service_1 = require("./payment.service");
const Booking_1 = require("@/models/Booking");
const mongoose_1 = require("mongoose");
const user_service_1 = __importDefault(require("./user.service"));
const hotels_service_1 = __importDefault(require("./hotels.service"));
const review_service_1 = __importDefault(require("./review.service"));
const queue_1 = __importDefault(require("@/queue/queue"));
const Hotel_1 = require("@/models/Hotel");
const { host, port, password, name } = config_1.default.redis;
class WorkerService {
    constructor() {
        this.workerHandler = async (job) => {
            switch (job.data.type) {
                case jobs_1.EJob.BOOKING_DECLINE: {
                    const bookingDb = await payment_service_1.bookingService.findById(job.data.job.id, null, {
                        lean: false,
                    });
                    if (!bookingDb) {
                        return;
                    }
                    if (bookingDb.status === Booking_1.Status.PENDING) {
                        bookingDb.status = Booking_1.Status.DECLINE;
                        await bookingDb.save();
                    }
                    return;
                }
                case jobs_1.EJob.BOOKING_STAY: {
                    const bookingDb = await payment_service_1.bookingService.findByPopulate({
                        _id: job.data.job.id,
                    }, { lean: false }, { path: 'rooms.roomTypeId', select: 'nameOfRoom -_id' });
                    if (!bookingDb) {
                        return;
                    }
                    const hotelDb = await hotels_service_1.default.findById(bookingDb.hotelId);
                    await user_service_1.default.findByIdUpdate(hotelDb.userId, {
                        $inc: {
                            'account.balance': bookingDb.total,
                            'account.virtualBalance': -bookingDb.total,
                        },
                    });
                    const userDb = await user_service_1.default.findById(bookingDb.userId);
                    bookingDb.status = Booking_1.Status.STAY;
                    await bookingDb.save();
                    const { _id, role, name } = userDb;
                    const createReview = await review_service_1.default.createOne({
                        images: [],
                        starRating: 0,
                        slug: new Date().getTime().toString(),
                        parent_slug: '',
                        author: { name, role, authorId: _id },
                        hotel: {
                            hotelId: new mongoose_1.Types.ObjectId(bookingDb.hotelId),
                            name: hotelDb.hotelName,
                        },
                        roomName: bookingDb.rooms.map((room) => room.roomTypeId.nameOfRoom),
                        bookingId: new mongoose_1.Types.ObjectId(bookingDb._id),
                    });
                    await (0, queue_1.default)({
                        type: jobs_1.EJob.DELETE_REVIEW,
                        job: { id: createReview._id.toHexString() },
                    }, {
                        delay: new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
                        priority: 10,
                        removeOnComplete: true,
                    });
                    return;
                }
                case jobs_1.EJob.DELETE_REVIEW: {
                    const reviewDb = await review_service_1.default.findById(job.data.job.id, null, {
                        lean: false,
                    });
                    if (!reviewDb.context || !reviewDb.starRating) {
                        await reviewDb.deleteOne();
                    }
                    return;
                }
                case jobs_1.EJob.MEMBERSHIP: {
                    const membershipsDb = await payment_service_1.memberShipService.findMany({
                        query: new mongoose_1.Types.ObjectId(job.data.job.userID),
                        page: null,
                        limit: null,
                    }, { lean: false });
                    const indexMembershipExpired = membershipsDb.findIndex((membership) => membership._id.equals(new mongoose_1.Types.ObjectId(job.data.job.id)));
                    if (indexMembershipExpired < 0)
                        return;
                    membershipsDb[indexMembershipExpired].isExpire = true;
                    await membershipsDb[indexMembershipExpired].save();
                    if (indexMembershipExpired === 0)
                        await hotels_service_1.default.updateMany({
                            userId: new mongoose_1.Types.ObjectId(job.data.job.userID),
                        }, { $set: { package: Hotel_1.Package.FREE } });
                    return;
                }
            }
        };
        this.connect();
    }
    connect() {
        const worker = new bullmq_1.Worker('myQueue', this.workerHandler, {
            connection: {
                host: host,
                port: parseInt(port),
                password,
                name,
            },
        });
        const logger = (0, log4js_1.getLogger)('bullmq');
        worker.on('ready', () => console.log('Bull mq Success'));
        worker.on('completed', (job) => console.log(job.id));
        worker.on('failed', (job, err) => {
            logger.error(`${job.data.type} has failed with ${err.message}`);
            console.log(`${job.data.type} has failed with ${err.message}`);
        });
    }
}
const workerService = new WorkerService();
exports.default = workerService;
