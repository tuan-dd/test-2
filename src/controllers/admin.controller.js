"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/helpers/utils");
const User_1 = require("@/models/User");
const hotels_service_1 = __importDefault(require("@/services/hotels.service"));
const user_service_1 = __importDefault(require("@/services/user.service"));
const lodashUtil_1 = require("@/utils/lodashUtil");
const mongoose_1 = require("mongoose");
class AdminController {
    constructor() {
        this.queryUsers = async (req, res) => {
            let query = (0, lodashUtil_1.getDeleteFilter)(['page,limit'], req.query);
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            query = (0, lodashUtil_1.getConvertCreatedAt)(query, ['name']);
            const users = await user_service_1.default.findMany({
                query,
                page,
                limit,
            }, { password: 0 });
            if (!users)
                throw new utils_1.NotAuthorizedError('Not found user');
            new utils_1.SuccessResponse({
                message: 'Get user`s data successfully',
                data: users,
            }).send(res);
        };
        this.detailUser = async (req, res) => {
            const id = req.params.id;
            const userDb = await user_service_1.default.findById(id);
            if (userDb.role === User_1.Role.HOTELIER) {
                const userDbByAggregate = await user_service_1.default.findUserByAggregate(id, {
                    password: 0,
                });
                oke(userDbByAggregate);
            }
            if (userDb.role === User_1.Role.USER) {
                const userDbByFindOne = await user_service_1.default.findById(id, { password: 0 });
                oke(userDbByFindOne);
            }
            function oke(value) {
                new utils_1.SuccessResponse({
                    message: 'Get user data successfully',
                    data: value,
                }).send(res);
            }
        };
        this.updateHotelByAdmin = async (req, res) => {
            const hotelId = new mongoose_1.Types.ObjectId(req.params.id);
            const newUpdate = await hotels_service_1.default.findOneUpdate({
                _id: hotelId,
            }, { $set: { isdDelete: req.body.isDelete } }, { new: true });
            if (!newUpdate)
                throw new utils_1.NotFoundError('Not found hotel');
            new utils_1.SuccessResponse({
                message: 'update by admin successfully',
                data: newUpdate,
            }).send(res);
        };
        this.updateByAdmin = async (req, res) => {
            const userId = req.params.id;
            const isActive = req.body.isActive;
            const userDb = await user_service_1.default.findById(userId, { lean: false });
            if (!userDb)
                throw new utils_1.NotFoundError('Not found user');
            userDb.isActive = isActive;
            await userDb.save();
            new utils_1.SuccessResponse({
                message: 'charge user successfully',
            }).send(res);
        };
    }
}
const adminController = new AdminController();
exports.default = adminController;
