"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertCreatedAt = exports.deleteKeyNull = exports.getDeleteFilter = exports.getFilterData = void 0;
const lodash_1 = __importDefault(require("lodash"));
const getFilterData = (filter, object) => {
    return lodash_1.default.pick(object, filter);
};
exports.getFilterData = getFilterData;
const getDeleteFilter = (filter, object) => {
    return lodash_1.default.omit(object, filter);
};
exports.getDeleteFilter = getDeleteFilter;
const deleteKeyNull = (pros) => {
    Object.keys(pros).forEach((key) => {
        if (!pros[key])
            delete pros[key];
    });
    return pros;
};
exports.deleteKeyNull = deleteKeyNull;
const getConvertCreatedAt = (pros, includes) => {
    const isCreatedAt = ['createdAt_gte', 'createdAt_lte'];
    if (pros.createdAt)
        pros.createdAt = { $gte: pros.createdAt };
    const convertDate = (key) => {
        if (key === '$gte') {
            pros.createdAt = {
                ...pros.createdAt,
                [key]: pros.createdAt_gte,
            };
            delete pros.createdAt_gte;
        }
        else {
            pros.createdAt = {
                ...pros.createdAt,
                [key]: pros.createdAt_lte,
            };
            delete pros.createdAt_lte;
        }
    };
    Object.keys(pros).forEach((key) => {
        if (!pros[key])
            delete pros[key];
        // RegExp like value.includes('abc')
        if (includes.includes(key) && pros[key]) {
            const regExp = new RegExp(pros[key], 'i');
            pros[key] = regExp;
        }
        if (isCreatedAt.includes(key) && pros[key]) {
            key === 'createdAt_gte' ? convertDate('$gte') : convertDate('$lte');
        }
    });
    return pros;
};
exports.getConvertCreatedAt = getConvertCreatedAt;
