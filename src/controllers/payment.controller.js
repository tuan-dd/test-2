"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/helpers/utils");
const validate_1 = require("@/middleware/validate");
const Booking_1 = require("@/models/Booking");
const Hotel_1 = require("@/models/Hotel");
const queue_1 = __importDefault(require("@/queue/queue"));
const hotels_service_1 = __importDefault(require("@/services/hotels.service"));
const payment_service_1 = require("@/services/payment.service");
const user_service_1 = __importDefault(require("@/services/user.service"));
const jobs_1 = require("@/utils/jobs");
const lodashUtil_1 = require("@/utils/lodashUtil");
const mongoose_1 = __importStar(require("mongoose"));
class PaymentController {
    constructor() {
        this.createBooking = async (req, res) => {
            /**
             * @check khách sạn có loai phòng đó k
             * @check
             * @create tao booking lưu booking id và bullmq
             */
            const newBooking = {
                rooms: req.body.rooms.map((room) => ({
                    quantity: room.quantity,
                    roomTypeId: new mongoose_1.default.Types.ObjectId(room.roomTypeId),
                })),
                userId: new mongoose_1.default.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]),
                hotelId: new mongoose_1.default.Types.ObjectId(req.body.hotelId),
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            };
            const rooms = newBooking.rooms;
            const NumberOfRoomAfterCheck = await payment_service_1.bookingService.isEnoughRoom(newBooking, rooms.map((room) => room.roomTypeId));
            // tại đây loop qua để tính tổng tiền và kiểm tra còn đủ k
            let total = 0;
            const roomsResults = [];
            NumberOfRoomAfterCheck.roomTypeIds.forEach((hotelDbRoom) => {
                rooms.forEach((roomOrderId) => {
                    if (roomOrderId.roomTypeId.equals(hotelDbRoom._id)) {
                        if (roomOrderId.quantity > hotelDbRoom.numberOfRoom)
                            throw new utils_1.BadRequestError('Exceed the number of rooms');
                        // lấy tên phòng và số lượng để trả res
                        const roomResult = {
                            nameOfRoom: hotelDbRoom.nameOfRoom,
                            quantity: roomOrderId.quantity,
                        };
                        roomsResults.push(roomResult);
                        total += roomOrderId.quantity * hotelDbRoom.price;
                    }
                });
            });
            newBooking.total = total;
            const createBooking = await payment_service_1.bookingService.createOne(newBooking);
            await (0, queue_1.default)({
                type: jobs_1.EJob.BOOKING_DECLINE,
                job: { id: createBooking._id.toHexString() },
            }, { removeOnComplete: true, delay: 1000 * 60 * 5, removeOnFail: true });
            new utils_1.CreatedResponse({
                message: 'Create Booking successfully',
                data: {
                    ...(0, lodashUtil_1.getFilterData)(['total', 'startDate', 'endDate', '_id'], createBooking),
                    rooms: roomsResults,
                    hotel: NumberOfRoomAfterCheck.hotelName,
                },
            }).send(res);
        };
        this.paymentBooking = async (req, res) => {
            const newPayment = {
                bookingId: new mongoose_1.Types.ObjectId(req.body.bookingId),
                password: req.body.password,
                hotelId: new mongoose_1.Types.ObjectId(req.body.hotelId),
            };
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const session = await mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const bookingDb = await payment_service_1.bookingService.findOne({
                    _id: newPayment.bookingId,
                    hotelId: newPayment.hotelId,
                }, null, { lean: false });
                if (!bookingDb)
                    throw new utils_1.NotFoundError('Not found payment');
                if (bookingDb.status !== Booking_1.Status.PENDING)
                    throw new utils_1.BadRequestError('Payment expired');
                const userDb = await user_service_1.default.findByIdAndCheckPass(userId, newPayment.password);
                if (typeof userDb === 'boolean')
                    throw new utils_1.ForbiddenError('can`t payment, try again');
                if (userDb.account.balance < bookingDb.total)
                    throw new utils_1.ForbiddenError('balance less than booking');
                const hotel = await hotels_service_1.default.findById(newPayment.hotelId);
                const hotelierDb = await user_service_1.default.findByIdUpdate(hotel.userId, {
                    $inc: { 'account.virtualBalance': bookingDb.total },
                }, { session });
                if (!hotelierDb)
                    throw new utils_1.NotFoundError('Not found Hotelier');
                userDb.account.balance = userDb.account.balance - bookingDb.total;
                await userDb.save({ session });
                bookingDb.status = Booking_1.Status.SUCCESS;
                await bookingDb.save({ session });
                const createJob = await (0, queue_1.default)({
                    type: jobs_1.EJob.BOOKING_STAY,
                    job: { id: bookingDb._id.toHexString() },
                }, {
                    delay: bookingDb.startDate.getTime(),
                    removeOnComplete: true,
                });
                if (!createJob)
                    throw new utils_1.BadRequestError('can`t payment, try again ');
                await session.commitTransaction();
                new utils_1.SuccessResponse({
                    message: 'Payment Booking successfully',
                }).send(res);
            }
            catch (error) {
                await session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        };
        this.cancelBooking = async (req, res) => {
            const cancelPayment = {
                bookingId: new mongoose_1.Types.ObjectId(req.body.bookingId),
                hotelId: new mongoose_1.Types.ObjectId(req.body.hotelId),
            };
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const session = await mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const bookingDb = await payment_service_1.bookingService.findById(cancelPayment.bookingId, null, {
                    lean: false,
                });
                if (!bookingDb)
                    throw new utils_1.NotFoundError('Not found payment');
                if (bookingDb.status !== Booking_1.Status.SUCCESS)
                    throw new utils_1.NotFoundError('User cant refund');
                const dataNow = new Date().getTime();
                if (bookingDb.startDate.getTime() - 1000 * 60 * 60 * 12 < dataNow)
                    throw new utils_1.BadRequestError('Overdue to cancel, you only cant cancel before 12h');
                if (userId !== bookingDb.userId.toHexString())
                    throw new utils_1.NotFoundError('Not found Booking');
                const hotelDb = await hotels_service_1.default.findById(cancelPayment.hotelId);
                const hotelierDb = await user_service_1.default.findByIdUpdate(hotelDb.userId, {
                    $inc: { 'account.virtualBalance': -bookingDb.total },
                }, { session });
                if (!hotelierDb)
                    throw new utils_1.NotFoundError('Not found Hotelier');
                await user_service_1.default.findByIdUpdate(userId, {
                    $inc: { 'account.balance': bookingDb.total },
                }, { session });
                bookingDb.status = Booking_1.Status.CANCEL;
                await bookingDb.save({ session });
                await session.commitTransaction();
                new utils_1.SuccessResponse({
                    message: 'Cancel Booking successfully',
                }).send(res);
            }
            catch (error) {
                await session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        };
        this.paymentMembership = async (req, res) => {
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const newMemberShip = {
                userId: new mongoose_1.Types.ObjectId(userId),
                package: req.body.package,
            };
            const session = await mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const userDb = await user_service_1.default.findByIdAndCheckPass(userId, req.body.password);
                if (typeof userDb === 'boolean')
                    throw new utils_1.BadRequestError('Wrong Password');
                if (userDb.account.balance < Hotel_1.PricePackage[newMemberShip.package])
                    throw new utils_1.ForbiddenError('Balance less than package');
                const membershipsOfUser = await payment_service_1.memberShipService.findMany({
                    query: { userId: new mongoose_1.Types.ObjectId(userId), isExpire: false },
                    page: null,
                    limit: null,
                });
                if (membershipsOfUser.length) {
                    // lấy ngày kết thúc của các gói chưa hết hạn làm ngày bắt đầu của gói mới
                    newMemberShip.timeStart = new Date(membershipsOfUser
                        .map((membership) => membership.timeEnd)
                        .sort((a, b) => a.getTime() - b.getTime())
                        .at(-1));
                }
                else {
                    // nếu chưa có thì bằng ngày hôm nay
                    newMemberShip.timeStart = new Date();
                }
                // Cho giá tiền của gói bằng thời số ngày theo tuần tháng năm
                newMemberShip.timeEnd = new Date(newMemberShip.timeStart.getTime() +
                    1000 * 60 * 60 * 24 * Hotel_1.PricePackage[newMemberShip.package]);
                const createMemberShip = await payment_service_1.memberShipService.createOneAtomic([newMemberShip], {
                    session,
                });
                if (newMemberShip.package === Hotel_1.Package.WEEK)
                    await hotels_service_1.default.findOneUpdate({
                        userId: newMemberShip.userId,
                        package: Hotel_1.Package.FREE,
                        isDelete: false,
                    }, { $set: { package: newMemberShip.package } }, { session });
                else if (newMemberShip.package === Hotel_1.Package.MONTH) {
                    await hotels_service_1.default.findOneUpdate({
                        userId: newMemberShip.userId,
                        package: Hotel_1.Package.WEEK,
                        isDelete: false,
                    }, { $set: { package: newMemberShip.package } }, { session });
                }
                else {
                    await hotels_service_1.default.findOneUpdate({
                        userId: newMemberShip.userId,
                        isDelete: false,
                    }, { $set: { package: newMemberShip.package } }, { session });
                }
                userDb.account.balance =
                    userDb.account.balance - Hotel_1.PricePackage[newMemberShip.package];
                await userDb.save({ session });
                const createJob = await (0, queue_1.default)({
                    type: jobs_1.EJob.MEMBERSHIP,
                    job: { id: createMemberShip[0]._id, userID: userId },
                }, { delay: newMemberShip.timeEnd.getTime() });
                if (!createJob)
                    throw new utils_1.BadRequestError('Can`t payment, try again ');
                await session.commitTransaction();
                new utils_1.CreatedResponse({
                    message: 'Payment membership successfully',
                }).send(res);
            }
            catch (error) {
                await session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        };
        this.chargeMoney = async (req, res) => {
            const balance = req.body.balance;
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const updateBalance = await user_service_1.default.findByIdUpdate(userId, {
                $inc: { 'account.balance': balance },
            }, {
                new: true,
            });
            new utils_1.SuccessResponse({
                message: 'charge successfully',
                data: updateBalance.account.balance,
            }).send(res);
        };
        this.withdrawMoney = async (req, res) => {
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const newUpdate = req.body;
            const session = await mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const userDb = await user_service_1.default.findByIdAndCheckPass(userId, req.body.password);
                if (typeof userDb === 'boolean')
                    throw new utils_1.BadRequestError('Wrong Password');
                if (userDb.account.balance < newUpdate.withdraw)
                    throw new utils_1.ForbiddenError('Balance less than withdraw');
                userDb.account.balance = userDb.account.balance - newUpdate.withdraw;
                await userDb.save({ session });
                await session.commitTransaction();
                new utils_1.CreatedResponse({
                    message: 'withdraw successfully',
                }).send(res);
            }
            catch (error) {
                await session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        };
        this.getMemberShips = async (req, res) => {
            const userId = new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]);
            let query = (0, lodashUtil_1.getDeleteFilter)(['page'], req.query);
            query = (0, lodashUtil_1.getConvertCreatedAt)(query, ['']);
            query.userId = userId;
            const page = req.query.page || 1;
            const memberships = await payment_service_1.memberShipService.findMany({
                query,
                page: page,
                limit: 10,
            });
            new utils_1.CreatedResponse({
                message: 'Get data`s MemberShips successfully',
                data: memberships,
            }).send(res);
        };
        this.getBookings = async (req, res) => {
            const userId = new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]);
            const page = req.query.page || 1;
            let query = (0, lodashUtil_1.getDeleteFilter)(['page'], req.query);
            query = (0, lodashUtil_1.getConvertCreatedAt)(query, ['']);
            query.userId = userId;
            const bookings = await payment_service_1.bookingService.findMany({
                query,
                page: page,
                limit: 10,
            });
            new utils_1.CreatedResponse({
                message: 'Get data`s Bookings successfully',
                data: bookings,
            }).send(res);
        };
    }
}
const paymentController = new PaymentController();
exports.default = paymentController;
// jest => unit test
// liet ke test cases cho 1 function cần test:
// - ko đủ balance
// - dư balance
// - vừa khớp balance
// mock/mocking
// const mockDb = jest.mock();
// e2e (end-to-end) testing
// e2e cho postman
// cho 1 api => define posibility input pairs
// e2e cho expressjs
// QC define test cases cho function/feature
// - ko đủ balance
// - dư balance
// - vừa khớp balance
