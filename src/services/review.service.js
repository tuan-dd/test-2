"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Review_1 = __importDefault(require("@/models/Review"));
const base_service_1 = __importDefault(require("./base.service"));
class ReviewService extends base_service_1.default {
    constructor() {
        super(Review_1.default);
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
const reviewService = new ReviewService();
exports.default = reviewService;
