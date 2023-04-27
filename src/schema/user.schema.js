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
exports.updateUserSchema = exports.createUserSchema = void 0;
const regexUtil_1 = __importDefault(require("@/utils/regexUtil"));
const Yup = __importStar(require("yup"));
exports.createUserSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No update _id'),
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string()
            .matches(regexUtil_1.default.PASSWORD_REGEX, 'Password contain at least one numeric digit, one uppercase and one lowercase letter,min 6 max 20')
            .required(),
        avatar: Yup.string()
            .matches(regexUtil_1.default.URL_REGEX, 'Must be url')
            .notRequired(),
    }),
});
exports.updateUserSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No update _id'),
        name: Yup.string().notRequired(),
        avatar: Yup.string()
            .matches(regexUtil_1.default.URL_REGEX, 'Must be url')
            .notRequired(),
        password: Yup.string().notRequired(),
        newPassword: Yup.string().when('password', (password, field) => password[0]
            ? field
                .matches(regexUtil_1.default.URL_REGEX, 'New Password contain at least one numeric digit, one uppercase and one lowercase letter, min 6 max 20')
                .notOneOf([Yup.ref('password'), null], 'New password must same password')
                .required()
            : field.max(0, 'Not input value because you don`t input current password')),
        confirmPassword: Yup.string().when('newPassword', (newPassword, field) => newPassword[0]
            ? field
                .oneOf([Yup.ref('newPassword')], 'not match new password')
                .required()
            : field.max(0, 'Not input value because you don`t input newPassword ')),
    }),
});
