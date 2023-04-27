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
exports.getMembershipSchema = exports.getBookingSchema = exports.paymentMembershipSchema = exports.cancelBookingSchema = exports.paymentBookingSchema = exports.createBookingSchema = exports.withdrawSchema = exports.chargeSchema = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const Booking_1 = require("@/models/Booking");
const Hotel_1 = require("@/models/Hotel");
const mongoose_1 = require("mongoose");
const Yup = __importStar(require("yup"));
// add function check objectId
Yup.addMethod(Yup.string, 'objectIdValid', function (message) {
    return this.test('objectIdValid', message || 'Wrong Id', (value) => {
        if (!value)
            return true;
        return mongoose_1.Types.ObjectId.isValid(value);
    });
});
exports.chargeSchema = Yup.object().shape({
    body: Yup.object().shape({
        balance: Yup.number().min(1).required(),
    }),
});
exports.withdrawSchema = Yup.object().shape({
    body: Yup.object().shape({
        password: Yup.string().required(),
        withdraw: Yup.number().min(1).required(),
    }),
});
exports.createBookingSchema = Yup.object().shape({
    body: Yup.object().shape({
        _id: Yup.string().max(0, 'no input value'),
        rooms: Yup.array(Yup.object().shape({
            roomTypeId: Yup.string().objectIdValid().required(),
            quantity: Yup.number().min(1).integer().required(),
        })),
        hotelId: Yup.string().objectIdValid().required(),
        startDate: Yup.date().min(new Date()).required(),
        endDate: Yup.date()
            .test('compareStartDate', 'Not less or equal than start date', (endDate, context) => (endDate <= context.parent.startDate ? false : true))
            .required(),
    }),
});
exports.paymentBookingSchema = Yup.object().shape({
    body: Yup.object().shape({
        password: Yup.string().required(),
        bookingId: Yup.string().objectIdValid().required(),
        hotelId: Yup.string().objectIdValid('Wrong Id').required(),
    }),
});
exports.cancelBookingSchema = Yup.object().shape({
    body: Yup.object().shape({
        bookingId: Yup.string().objectIdValid('Wrong Id').required(),
        hotelId: Yup.string().objectIdValid('Wrong Id').required(),
    }),
});
exports.paymentMembershipSchema = Yup.object().shape({
    body: Yup.object().shape({
        password: Yup.string().required(),
        package: Yup.string()
            .oneOf(Object.values(Hotel_1.Package).filter((e) => e !== Hotel_1.Package.FREE))
            .required(),
    }),
});
exports.getBookingSchema = Yup.object().shape({
    query: Yup.object().shape({
        page: Yup.number().integer().min(1).notRequired(),
        status: Yup.string().oneOf(Object.values(Booking_1.Status)).notRequired(),
    }),
});
exports.getMembershipSchema = Yup.object().shape({
    query: Yup.object().shape({
        page: Yup.number().integer().min(1).notRequired(),
        package: Yup.string()
            .oneOf(Object.values(Hotel_1.Package).filter((e) => e !== Hotel_1.Package.FREE))
            .notRequired(),
        isExpire: Yup.boolean().notRequired(),
    }),
});
