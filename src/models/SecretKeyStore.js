"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const secretKeyStoreSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true,
        ref: 'users',
    },
    secretKey: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },
}, { timestamps: true, expires: '7day', collection: 'keyStores' });
const SecretKeyStore = (0, mongoose_1.model)('keyStores', secretKeyStoreSchema);
exports.default = SecretKeyStore;
