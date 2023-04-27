"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
function getHash(password, SALT_ROUNDS) {
    return bcrypt_1.default.hash(password, SALT_ROUNDS);
}
function getSalt(SALT_ROUNDS = 10) {
    return bcrypt_1.default.genSalt(SALT_ROUNDS);
}
function getCompare(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
exports.default = { getHash, getCompare, getSalt };
