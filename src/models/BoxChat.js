"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatBoxSchema = new mongoose_1.Schema({
    userCreateId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'users',
    },
    userTwoId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'users',
    },
    messageIds: [
        {
            type: mongoose_1.SchemaTypes.ObjectId,
            required: true,
            ref: 'chatMessages',
        },
    ],
}, { timestamps: true, collection: 'boxChats' });
const BoxChat = (0, mongoose_1.model)('boxChats', chatBoxSchema);
exports.default = BoxChat;
