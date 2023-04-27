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
exports.getHotelSchema = exports.updateRoomSchema = exports.createRoomSchema = exports.updateHotelSchema = exports.createHotelSchema = void 0;
const Hotel_1 = require("@/models/Hotel");
const Room_type_1 = require("@/models/Room-type");
const regexUtil_1 = __importDefault(require("@/utils/regexUtil"));
const Yup = __importStar(require("yup"));
exports.createHotelSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No have _id'),
        hotelName: Yup.string().required(),
        address: Yup.string().required(),
        city: Yup.string().required(),
        country: Yup.string().required(),
        zipCode: Yup.number().integer().min(999).required(),
        propertyType: Yup.string().oneOf(Object.values(Hotel_1.PropertyType)).required(),
        star: Yup.number().min(0.5).max(5).required(),
        package: Yup.string().max(0, 'No have package'),
        images: Yup.string().matches(regexUtil_1.default.URL_REGEX, 'Must be url').notRequired(),
        roomTypes: Yup.array(Yup.object().shape({
            _id: Yup.string().max(0, 'No update _id'),
            roomAmenities: Yup.array(Yup.string().oneOf(Object.values(Room_type_1.RoomAmenities))).required(),
            nameOfRoom: Yup.string().required(),
            rateDescription: Yup.string().required(),
            price: Yup.number().min(1).required(),
            mealType: Yup.string().notRequired(),
            taxType: Yup.string().notRequired(),
            images: Yup.array(Yup.string().matches(regexUtil_1.default.URL_REGEX, 'Must be url')).required(),
            numberOfRoom: Yup.number().min(1).integer().required(),
        })).required('RoomTypes have 1'),
    }),
});
exports.updateHotelSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No update _id'),
        package: Yup.string().max(0, 'No have package'),
        hotelName: Yup.string().notRequired(),
        address: Yup.string().notRequired(),
        city: Yup.string().notRequired(),
        country: Yup.string().notRequired(),
        zipCode: Yup.number().integer().min(999).notRequired(),
        propertyType: Yup.string().oneOf(Object.values(Hotel_1.PropertyType)).notRequired(),
        star: Yup.number().min(0.5).max(5).notRequired(),
        images: Yup.string().matches(regexUtil_1.default.URL_REGEX, 'Must be url').notRequired(),
        isDelete: Yup.boolean().notRequired(),
    }),
});
exports.createRoomSchema = Yup.object().shape({
    body: Yup.object().shape({
        isCreateMulti: Yup.boolean().notRequired(),
        roomTypes: Yup.array(Yup.object().shape({
            _id: Yup.string().max(0, 'No update _id'),
            roomAmenities: Yup.array(Yup.string().oneOf(Object.values(Room_type_1.RoomAmenities))).required(),
            nameOfRoom: Yup.string().required(),
            rateDescription: Yup.string().required(),
            price: Yup.number().min(1).required(),
            mealType: Yup.string().notRequired(),
            taxType: Yup.string().notRequired(),
            images: Yup.array(Yup.string().matches(regexUtil_1.default.URL_REGEX, 'Must be url'))
                .min(1)
                .required(),
            numberOfRoom: Yup.number().min(1).integer().required(),
        }))
            .min(1)
            .required(),
    }),
});
exports.updateRoomSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'No update _id'),
        roomAmenities: Yup.array(Yup.string().oneOf(Object.values(Room_type_1.RoomAmenities))).notRequired(),
        nameOfRoom: Yup.string().notRequired(),
        rateDescription: Yup.string().notRequired(),
        price: Yup.number().min(1).notRequired(),
        mealType: Yup.string().notRequired(),
        taxType: Yup.string().notRequired(),
        images: Yup.array(Yup.string().matches(regexUtil_1.default.URL_REGEX, 'Must be url')).notRequired(),
        numberOfRoom: Yup.number().min(1).integer().notRequired(),
    }),
});
exports.getHotelSchema = Yup.object().shape({
    query: Yup.object().shape({
        hotelName: Yup.string().notRequired(),
        address: Yup.string().notRequired(),
        city: Yup.string().notRequired(),
        country: Yup.string().when('city', (city, field) => city.length ? field.notRequired() : field.required()),
        zipCode: Yup.number().integer().min(999).notRequired(),
        propertyType: Yup.string().oneOf(Object.values(Hotel_1.PropertyType)).notRequired(),
        star: Yup.number().min(0.5).max(5).notRequired(),
        createdAt_gte: Yup.date().max(new Date()).notRequired(),
        createdAt_lte: Yup.date().min('2023-04-06').notRequired(),
        createdAt: Yup.date().when(['createdAt_gte', 'createdAt_lte'], {
            is: (createdAt_gte, createdAt_lte) => createdAt_gte || createdAt_lte,
            then: (field) => field.max(0, 'Cant input the value because you had value createdAt_gte or createdAt_lte '),
            otherwise: (field) => field.notRequired(),
        }),
        page: Yup.number().integer().negative().min(1).notRequired(),
        limit: Yup.number().integer().negative().min(15).max(45).notRequired(),
    }),
});
