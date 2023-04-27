"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_controller_1 = __importDefault(require("@/controllers/payment.controller"));
const validate_1 = require("@/middleware/validate");
const payment_schema_1 = require("@/schema/payment.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @payment atomic
 * @
 */
router.use(validate_1.checkUser);
router.post('/create-booking', (0, validate_1.validateRequest)(payment_schema_1.createBookingSchema), (0, validate_1.catchError)(payment_controller_1.default.createBooking));
router.put('/payment-booking', (0, validate_1.validateRequest)(payment_schema_1.paymentBookingSchema), (0, validate_1.catchError)(payment_controller_1.default.paymentBooking));
router.put('/cancel-booking', (0, validate_1.validateRequest)(payment_schema_1.cancelBookingSchema), (0, validate_1.catchError)(payment_controller_1.default.cancelBooking));
router.put('/charge', (0, validate_1.validateRequest)(payment_schema_1.chargeSchema), (0, validate_1.catchError)(payment_controller_1.default.chargeMoney));
router.put('/withdraw', (0, validate_1.validateRequest)(payment_schema_1.withdrawSchema), (0, validate_1.catchError)(payment_controller_1.default.withdrawMoney));
router.put('/payment-membership', (0, validate_1.validateRequest)(payment_schema_1.paymentMembershipSchema), (0, validate_1.catchError)(payment_controller_1.default.paymentMembership));
router.get('/booking', (0, validate_1.validateRequest)(payment_schema_1.getBookingSchema), (0, validate_1.catchError)(payment_controller_1.default.getBookings));
router.get('/membership', (0, validate_1.validateRequest)(payment_schema_1.getMembershipSchema), (0, validate_1.catchError)(payment_controller_1.default.getMemberShips));
exports.default = router;
