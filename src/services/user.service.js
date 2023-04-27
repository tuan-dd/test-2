"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("@/models/User"));
const mongoose_1 = require("mongoose");
const base_service_1 = __importDefault(require("./base.service"));
const pwdUtil_1 = __importDefault(require("@/utils/pwdUtil"));
class UserService extends base_service_1.default {
    constructor() {
        super(User_1.default);
        this.findByIdAndCheckPass = async (id, password, option) => {
            const userDb = await User_1.default.findById(id, null, {
                lean: false,
                ...option,
            });
            const isValid = await pwdUtil_1.default.getCompare(password, userDb.password);
            if (!isValid)
                return false;
            return userDb;
        };
        this.findUserByAggregate = async (userId, project) => {
            return await User_1.default.aggregate([
                { $match: { _id: new mongoose_1.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'hotels',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'hotels',
                    },
                },
                { $unwind: '$hotels' },
                {
                    $lookup: {
                        from: 'roomTypes',
                        localField: 'hotels.roomTypeIds',
                        foreignField: '_id',
                        as: 'roomTypes',
                    },
                },
                { $project: { 'hotels.roomTypeIds': 0, password: 0, ...project } },
            ]);
        };
        this.findUserAddInfo = async (userId, project) => {
            return await User_1.default.aggregate([
                { $match: { _id: new mongoose_1.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'hotels',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'hotels',
                    },
                },
                { $unwind: '$hotels' },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: 'hotels._id',
                        foreignField: 'hotel.hotelId',
                        as: 'reviews',
                    },
                },
                { $unwind: '$reviews' },
                { $group: { _id: 'countReview' } },
                { $project: { 'hotels.roomTypeIds': 0, password: 0, ...project } },
            ]);
        };
    }
}
const userService = new UserService();
exports.default = userService;
