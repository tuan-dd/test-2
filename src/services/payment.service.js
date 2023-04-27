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
exports.memberShipService = exports.bookingService = void 0;
const Booking_1 = __importStar(require("@/models/Booking"));
const base_service_1 = __importDefault(require("./base.service"));
const Membership_1 = __importDefault(require("@/models/Membership"));
const utils_1 = require("@/helpers/utils");
const hotels_service_1 = __importDefault(require("./hotels.service"));
class BookingService extends base_service_1.default {
    constructor() {
        super(Booking_1.default);
        this.findMany = async (query, option) => {
            return await this.Model.find(query.query, null, {
                lean: true,
                ...option,
            })
                .skip(query.limit * (query.page - 1))
                .limit(query.limit)
                .sort('-createdAt')
                .exec();
        };
        this.findByPopulate = async (query, option, optionPopulate) => {
            return await Booking_1.default.findById(query, null, { lean: true, ...option })
                .populate({
                path: 'rooms.roomTypeId',
                ...optionPopulate,
            })
                .exec();
        };
        this.isEnoughRoom = async (newBooking, rooms) => {
            const hotelDb = await hotels_service_1.default.findOneAndPopulateByQuery({
                _id: newBooking.hotelId,
                roomTypeIds: {
                    // kiểm các loại phòng đặt có phải trong hotelDb k
                    $all: rooms,
                },
            }, {
                path: 'roomTypeIds',
                match: { _id: { $in: rooms } },
                select: 'price numberOfRoom nameOfRoom',
            });
            if (!hotelDb)
                throw new utils_1.NotAuthorizedError('Cant not find hotel');
            // tìm kiếm các booking ở trong khoảng thời gian đặt của new booking
            const bookingsDb = await bookingService.findMany({
                query: {
                    hotelId: newBooking.hotelId,
                    status: Booking_1.Status.SUCCESS,
                    startDate: { $gte: newBooking.startDate },
                    endDate: { $lte: newBooking.endDate },
                    'rooms.roomTypeId': { $in: rooms },
                },
                page: null,
                limit: null,
            });
            // kiểm tra trùng room in booking trừ ra số phòng đăt ra
            hotelDb.roomTypeIds.forEach((hotelDbRoom, i) => {
                bookingsDb.forEach((booking) => {
                    booking.rooms.forEach((room) => {
                        if (room.roomTypeId.equals(hotelDbRoom._id)) {
                            hotelDb.roomTypeIds[i].numberOfRoom -= room.quantity;
                        }
                    });
                });
            });
            return hotelDb;
        };
    }
}
class MemberShipService extends base_service_1.default {
    constructor() {
        super(Membership_1.default);
        this.createOneAtomic = async (doc, option) => {
            return await Membership_1.default.create(doc, option);
        };
        this.findMany = async (query, option) => {
            return await this.Model.find(query.query, null, {
                lean: true,
                ...option,
            })
                .skip(query.limit * (query.page - 1))
                .limit(query.limit)
                .sort('-createdAt')
                .exec();
        };
    }
}
const bookingService = new BookingService();
exports.bookingService = bookingService;
const memberShipService = new MemberShipService();
exports.memberShipService = memberShipService;
