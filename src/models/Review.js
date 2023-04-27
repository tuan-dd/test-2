"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_1 = require("./User");
const reviewSchema = new mongoose_1.Schema({
    context: {
        type: String,
        default: 'no',
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    starRating: {
        type: Number,
        default: 0,
        max: 5,
        min: 0,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    parent_slug: {
        type: String,
        default: '',
    },
    author: {
        name: { type: String, required: true },
        authorId: { type: mongoose_1.SchemaTypes.ObjectId, required: true, ref: 'Users' },
        role: { type: String, required: true, enum: Object.values(User_1.Role) },
    },
    hotel: {
        name: {
            type: String,
            required: true,
        },
        hotelId: { type: mongoose_1.SchemaTypes.ObjectId, required: true, ref: 'hotels' },
    },
    bookingId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'hotels',
    },
    roomName: [
        {
            type: String,
            required: true,
            min: 1,
        },
    ],
    isReply: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDelete: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true, collection: 'reviews' });
const Review = (0, mongoose_1.model)('reviews', reviewSchema);
exports.default = Review;
