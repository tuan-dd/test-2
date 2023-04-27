"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/// advance update img
const chatMessageSchema = new mongoose_1.Schema({
    content: {
        type: String,
        minlength: 1,
        required: true,
    },
    chatBoxId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'BoxChats',
    },
    senderId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'Users',
    },
}, { timestamps: true, collection: 'chatMessages' });
//Export the model
const ChatMessage = (0, mongoose_1.model)('chatMessages', chatMessageSchema);
exports.default = ChatMessage;
