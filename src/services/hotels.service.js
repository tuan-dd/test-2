"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hotel_1 = __importDefault(require("@/models/Hotel"));
const base_service_1 = __importDefault(require("./base.service"));
class HotelService extends base_service_1.default {
    constructor() {
        super(Hotel_1.default);
        // static createHotels = async (newUser: IHotel) => {
        //   return await Hotel.create(newUser);
        // };
        // static findOneHotelUpdate = async (
        //   query: FilterQuery<HotelDocument>,
        //   update: UpdateQuery<HotelDocument>,
        //   option?: QueryOptions,
        // ) => {
        //   return await Hotel.findOneAndUpdate(query, update, {
        //     lean: true,
        //     ...option,
        //   }).exec();
        // };
        // static findHotelsUpdate = async (
        //   query: FilterQuery<HotelDocument>,
        //   update: UpdateQuery<HotelDocument>,
        //   option?: QueryOptions,
        // ) => {
        //   return await Hotel.updateMany(query, update, {
        //     lean: true,
        //     ...option,
        //   }).exec();
        // };
        // static findHotels = async (
        //   queryHotel: QueryWithPagination<HotelDocument>,
        //   option?: QueryOptions,
        // ) => {
        //   return await Hotel.find(queryHotel.query, null, {
        //     lean: true,
        //     ...option,
        //   })
        //     .skip(queryHotel.limit * (queryHotel.page - 1))
        //     .limit(queryHotel.limit)
        //     .exec();
        // };
        this.findOneAndPopulateById = async (hotelId, options) => {
            return await Hotel_1.default.findById(hotelId)
                .populate({
                path: 'roomTypeIds',
                ...options,
            })
                .lean()
                .exec();
        };
        this.findOneAndPopulateByQuery = async (query, options) => {
            return await Hotel_1.default.findOne(query)
                .populate({
                path: 'roomTypeIds',
                ...options,
            })
                .lean()
                .exec();
        };
    }
}
exports.default = new HotelService();
