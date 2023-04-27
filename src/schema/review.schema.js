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
exports.getReviewsSchema = exports.getReviewsByUserSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const Booking_1 = require("@/models/Booking");
const regexUtil_1 = __importDefault(require("@/utils/regexUtil"));
const Yup = __importStar(require("yup"));
exports.createReviewSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No input value'),
        context: Yup.string().min(1).max(500).required(),
        images: Yup.array(Yup.string().matches(regexUtil_1.default.URL_REGEX)).notRequired(),
        starRating: Yup.number().min(0.5).max(5).required(),
        parent_slug: Yup.string().notRequired(),
        hotelId: Yup.string().objectIdValid().required(),
    }),
});
exports.updateReviewSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No input value'),
        context: Yup.string().min(1).max(500).required(),
        images: Yup.array(Yup.string().matches(regexUtil_1.default.URL_REGEX)).notRequired(),
        starRating: Yup.number().min(0.5).max(5).required(),
        isDelete: Yup.boolean().notRequired(),
    }),
});
exports.getReviewsByUserSchema = Yup.object().shape({
    query: Yup.object().shape({
        statusBooking: Yup.string().oneOf([Booking_1.Status.STAY]).notRequired(),
        isReview: Yup.boolean().notRequired(),
        parent_slug: Yup.boolean().notRequired(),
        page: Yup.number().integer().negative().min(1).notRequired(),
        limit: Yup.number().integer().negative().min(15).max(45).notRequired(),
        hotelId: Yup.string().objectIdValid().notRequired(),
    }),
});
exports.getReviewsSchema = Yup.object().shape({
    query: Yup.object().shape({
        hotelId: Yup.string().objectIdValid().notRequired(),
        parent_slug: Yup.string().notRequired(),
        page: Yup.number().integer().negative().min(1).notRequired(),
        limit: Yup.number().integer().negative().min(15).max(45).notRequired(),
    }),
});
