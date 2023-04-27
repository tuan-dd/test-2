"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Hotel_1 = require("./Hotel");
const membershipSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'users',
    },
    package: {
        type: String,
        enum: Object.values(Hotel_1.Package),
        required: true,
    },
    timeStart: { type: Date, default: new Date(), required: true },
    timeEnd: { type: Date, required: true },
    isExpire: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true, collection: 'memberships' });
const Membership = (0, mongoose_1.model)('memberships', membershipSchema);
exports.default = Membership;
