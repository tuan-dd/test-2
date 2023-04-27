"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/helpers/utils");
const validate_1 = require("@/middleware/validate");
const Hotel_1 = require("@/models/Hotel");
const User_1 = require("@/models/User");
const queue_1 = __importDefault(require("@/queue/queue"));
const hotels_service_1 = __importDefault(require("@/services/hotels.service"));
const keyStore_service_1 = __importDefault(require("@/services/keyStore.service"));
const payment_service_1 = require("@/services/payment.service");
const roomType_service_1 = __importDefault(require("@/services/roomType.service"));
const user_service_1 = __importDefault(require("@/services/user.service"));
const jobs_1 = require("@/utils/jobs");
const lodashUtil_1 = require("@/utils/lodashUtil");
const tokenUtil_1 = __importDefault(require("@/utils/tokenUtil"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
class HotelController {
    constructor() {
        this.createHotel = async (req, res) => {
            /**
             * @check duplicateRDuplicateError Hotel
             * @create Hotel , room types db
             * @package membership week
             * @create  create membership DB
             * @redis {key:membershipId : value 'membership' } expires 1 week redis key memberShipId : 'memberShipId'
             * @create if user create a first hotel so update accessToken, refreshToken  role Hollers update secretKeyStore
             * @send data
             */
            const { role, email } = req.user;
            const newHotel = (0, lodashUtil_1.getDeleteFilter)(['roomTypes'], req.body);
            newHotel.userId = new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]);
            const roomTypes = req.body.roomTypes;
            const hotelsDb = await hotels_service_1.default.findMany({
                query: { userId: newHotel.userId },
                page: null,
                limit: null,
            });
            hotelsDb.forEach((hotelDb) => {
                if (hotelDb.hotelName === newHotel.hotelName)
                    throw new utils_1.DuplicateError('DuplicateError new hotel name');
            });
            const createRoomsSuccess = await roomType_service_1.default.createMany(roomTypes);
            newHotel.roomTypeIds = createRoomsSuccess.map((room) => room._id);
            const createHotelSuccess = await hotels_service_1.default.createOne(newHotel);
            const week = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
            if (!hotelsDb.length) {
                const createMembership = await payment_service_1.memberShipService.createOne({
                    userId: newHotel.userId,
                    timeEnd: week,
                    package: Hotel_1.Package.WEEK,
                    isExpire: false,
                });
                const createJob = await (0, queue_1.default)({
                    type: jobs_1.EJob.MEMBERSHIP,
                    job: { id: createMembership._id, userID: newHotel.userId },
                }, { delay: week.getTime() });
                if (!createJob) {
                    throw new utils_1.BadRequestError('can`t payment, try again ');
                }
                newHotel.package = Hotel_1.Package.WEEK;
            }
            newHotel.package = hotelsDb[0].package;
            if (role === User_1.Role.USER) {
                const secretKey = crypto_1.default.randomBytes(32).toString('hex');
                const { accessToken, refreshToken } = tokenUtil_1.default.createTokenPair({ role: User_1.Role.HOTELIER, email }, secretKey);
                await keyStore_service_1.default.findOneUpdate({ userId: newHotel.userId, deviceId: req.ip }, {
                    refreshToken,
                    secretKey,
                });
                await user_service_1.default.findOneUpdate({ _id: newHotel.userId }, { $set: { role: User_1.Role.HOTELIER } });
                res
                    .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                })
                    .cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                return oke();
            }
            oke();
            function oke() {
                new utils_1.CreatedResponse({
                    message: 'Create hotel successfully',
                    data: (0, lodashUtil_1.getFilterData)(['hotelName', 'image', 'address', 'package', 'city', 'country', '_id'], createHotelSuccess),
                }).send(res);
            }
        };
        this.updateHotel = async (req, res) => {
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            if (req.body.isDelete) {
                const result = await hotels_service_1.default.findOneUpdate({
                    userId,
                    _id: new mongoose_1.Types.ObjectId(req.params.id),
                }, { $set: { isDelete: true } }, { new: true });
                return oke(result);
            }
            const result = await hotels_service_1.default.findOneUpdate({
                userId,
                _id: new mongoose_1.Types.ObjectId(req.params.id),
                isDelete: false,
            }, { $set: { ...req.body } }, { new: true });
            oke(result);
            function oke(result) {
                if (!result)
                    throw new utils_1.NotFoundError('Not found hotel');
                new utils_1.SuccessResponse({
                    message: 'Update hotel successfully',
                }).send(res);
            }
        };
        this.createRoom = async (req, res) => {
            const newRooms = await roomType_service_1.default.createMany(req.body.roomTypes);
            const userId = new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]);
            const roomIds = newRooms.map((pros) => pros._id);
            const hotelId = new mongoose_1.Types.ObjectId(req.params.id);
            if (req.body.isCreateMulti) {
                await hotels_service_1.default.updateMany({ userId, isDelete: false }, { $addToSet: { roomTypeIds: roomIds } });
                return oke();
            }
            // id co the client sai
            const updateHotel = await hotels_service_1.default.findOneUpdate({ _id: hotelId, userId, isDelete: false }, {
                $addToSet: { roomTypeIds: roomIds },
            });
            if (!updateHotel) {
                await roomType_service_1.default.deleteRoomType({
                    _id: { $in: roomIds },
                });
                throw new utils_1.NotFoundError('Not found hotel');
            }
            else {
                return oke();
            }
            function oke() {
                return new utils_1.CreatedResponse({
                    message: 'Add room type successfully',
                    data: newRooms,
                }).send(res);
            }
        };
        this.updateRoomType = async (req, res) => {
            const roomId = req.params.id;
            const newUpdate = req.body;
            const result = await roomType_service_1.default.findByIdUpdate(roomId, {
                $set: newUpdate,
            }, { new: true });
            if (!result)
                throw new utils_1.NotFoundError('Not found room');
            new utils_1.SuccessResponse({
                message: 'Update room type successfully',
            }).send(res);
        };
        this.getHotels = async (req, res) => {
            let query = (0, lodashUtil_1.getDeleteFilter)(['page,limit'], req.query);
            const page = req.query.page | 1;
            const limit = req.query.limit | 15;
            query = (0, lodashUtil_1.getConvertCreatedAt)(query, ['city', 'hotelName', 'country']);
            query.isDelete = false;
            query.package = { $ne: Hotel_1.Package.FREE };
            const hotels = await hotels_service_1.default.findMany({ query, page, limit });
            if (!hotels.length)
                throw new utils_1.NotFoundError('Not found hotel');
            new utils_1.SuccessResponse({
                message: 'get hotel`s data successfully',
                data: hotels,
            }).send(res);
        };
        this.detailHotel = async (req, res) => {
            const hotelId = req.params.id;
            const hotel = await hotels_service_1.default.findOneAndPopulateById(hotelId);
            if (!hotel)
                throw new utils_1.NotFoundError('Not found hotel');
            new utils_1.SuccessResponse({
                message: 'Get detail hotel successfully',
                data: hotel,
            }).send(res);
        };
    }
}
const hotelController = new HotelController();
exports.default = hotelController;
