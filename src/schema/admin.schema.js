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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHotelByAdminSchema = exports.updateUserByAdminSchema = exports.queryUserSchema = void 0;
const User_1 = require("@/models/User");
const Yup = __importStar(require("yup"));
exports.queryUserSchema = Yup.object().shape({
    query: Yup.object().shape({
        email: Yup.string().email().notRequired(),
        name: Yup.string().notRequired(),
        role: Yup.string().oneOf(Object.values(User_1.Role)).notRequired(),
        createdAt_gte: Yup.date().max(new Date()).notRequired(),
        createdAt_lte: Yup.date().min('2023-04-06').notRequired(),
        createdAt: Yup.date().when(['createdAt_gte', 'createdAt_lte'], {
            is: (createdAt_gte, createdAt_lte) => createdAt_gte || createdAt_lte,
            then: (field) => field.max(0, 'Cant input the value because you had value createdAt_gte or createdAt_lte '),
            otherwise: (field) => field.notRequired(),
        }),
        page: Yup.number().integer().negative().min(1).notRequired(),
        limit: Yup.number().integer().negative().min(10).max(30).notRequired(),
    }),
});
exports.updateUserByAdminSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No update _id'),
        isActive: Yup.boolean().required(),
    }),
});
exports.updateHotelByAdminSchema = Yup.object()
    .shape({
    body: Yup.object()
        .shape({
        _id: Yup.string().max(0, 'No update _id'),
        isDelete: Yup.boolean().required(),
    })
        .noUnknown('Not input other value'),
})
    .noUnknown('Not input other value');
