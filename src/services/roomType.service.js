"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_type_1 = __importDefault(require("@/models/Room-type"));
const base_service_1 = __importDefault(require("./base.service"));
class RoomTypeService extends base_service_1.default {
    constructor() {
        super(Room_type_1.default);
        this.createMany = async (doc) => {
            return await Room_type_1.default.create(doc);
        };
        this.deleteRoomType = async (query, option) => {
            return await Room_type_1.default.deleteMany(query, option);
        };
    }
}
exports.default = new RoomTypeService();
