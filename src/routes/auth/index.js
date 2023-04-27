"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("@/middleware/validate");
const auth_controller_1 = __importDefault(require("@/controllers/auth.controller"));
const auth_schema_1 = require("@/schema/auth.schema");
const otp_schema_1 = require("@/schema/otp.schema");
/**
 * @login required email , password // send code
 *
 */
const router = express_1.default.Router();
router.post('/sign-in', (0, validate_1.validateRequest)(auth_schema_1.signinSchema), (0, validate_1.catchError)(auth_controller_1.default.signIn));
router.post('/authCode', (0, validate_1.validateRequest)(otp_schema_1.otpSchema), (0, validate_1.catchError)(auth_controller_1.default.authCode));
router.post('/new-access-token', (0, validate_1.catchError)(auth_controller_1.default.getNewAccessToken));
/// check header have access token userId
router.use(validate_1.checkUser);
router.post('/sign-out', (0, validate_1.catchError)(auth_controller_1.default.signOut));
// router.post('/staymate/signin', catchError(authController.forgetPwd));
// router.use(catchError(isAuth));
exports.default = router;
