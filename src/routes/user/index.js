"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("@/controllers/user.controller"));
const validate_1 = require("@/middleware/validate");
const user_schema_1 = require("@/schema/user.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @Admin send new pass(random)to email user
 * block user
 * see all user ( cant not see money,password)
 * @user can see all my account
 */
// create Account
router.post('/sign-up', (0, validate_1.validateRequest)(user_schema_1.createUserSchema), (0, validate_1.catchError)(user_controller_1.default.createUser));
// check header
router.use(validate_1.checkUser);
router.put('/user-update', (0, validate_1.validateRequest)(user_schema_1.updateUserSchema), (0, validate_1.catchError)(user_controller_1.default.updateUser));
router.get('/me', (0, validate_1.validateRequest)(user_schema_1.updateUserSchema), (0, validate_1.catchError)(user_controller_1.default.updateUser));
exports.default = router;
