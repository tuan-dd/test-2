"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const mongoose_1 = require("mongoose");
var Status;
(function (Status) {
    Status["PENDING"] = "PENDING";
    Status["SUCCESS"] = "SUCCESS";
    Status["STAY"] = "STAY";
    Status["DECLINE"] = "DECLINE";
    Status["CANCEL"] = "CANCEL";
})(Status = exports.Status || (exports.Status = {}));
// cần thêm startDate, endDate
const bookingSchema = new mongoose_1.Schema({
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: Status.PENDING,
        enum: Object.values(Status),
        required: true,
    },
    rooms: [
        {
            roomTypeId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                required: true,
                ref: 'roomTypes',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'users',
    },
    hotelId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'hotels',
    },
}, { timestamps: true, collection: 'booking' });
const Booking = (0, mongoose_1.model)('booking', bookingSchema);
exports.default = Booking;
