"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
// const { Types, Schema } = mongoose;
var Role;
(function (Role) {
    Role["HOTELIER"] = "HOTELIER";
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
})(Role = exports.Role || (exports.Role = {}));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    account: {
        balance: { type: Number, default: 0, required: true },
        virtualBalance: { type: Number, default: 0, required: true },
    },
    verify: {
        type: Boolean,
        default: false,
        required: true,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        default: Role.USER,
        enum: Object.values(Role),
        required: true,
    },
    isActive: { type: Boolean, default: true, required: true },
}, { timestamps: true, collection: 'users' });
const pwdUtil_1 = __importDefault(require("@/utils/pwdUtil"));
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await pwdUtil_1.default.getSalt();
    const hash = await pwdUtil_1.default.getHash(this.password, salt);
    this.password = hash;
});
const User = (0, mongoose_1.model)('users', userSchema);
exports.default = User;
