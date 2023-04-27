"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createTokenPair = (PayLoadInToken, secretKey) => {
    const accessToken = jsonwebtoken_1.default.sign(PayLoadInToken, secretKey, {
        expiresIn: '3 day',
    });
    const refreshToken = jsonwebtoken_1.default.sign(PayLoadInToken, secretKey, {
        expiresIn: '7 day',
    });
    return { accessToken, refreshToken };
};
const createToken = (PayLoadInToken, secretKey, expires) => {
    return jsonwebtoken_1.default.sign(PayLoadInToken, secretKey, { expiresIn: expires });
};
const verifyToken = (token, secretKey) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        return decodedToken;
    }
    catch (err) {
        return false;
    }
};
exports.default = { createTokenPair, verifyToken, createToken };
