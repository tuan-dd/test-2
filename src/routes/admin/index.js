"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("@/middleware/validate");
const User_1 = require("@/models/User");
const admin_schema_1 = require("@/schema/admin.schema");
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("@/controllers/admin.controller"));
const router = express_1.default.Router();
router.use(validate_1.checkUser);
router.use((0, validate_1.checkRole)(User_1.Role.ADMIN));
router.get('/', (0, validate_1.validateRequest)(admin_schema_1.queryUserSchema), (0, validate_1.catchError)(admin_controller_1.default.queryUsers));
router.get('/:id', validate_1.checkParamsId, (0, validate_1.catchError)(admin_controller_1.default.detailUser));
router.put('/user/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(admin_schema_1.updateUserByAdminSchema), (0, validate_1.catchError)(admin_controller_1.default.updateByAdmin));
router.put('/hotel/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(admin_schema_1.updateHotelByAdminSchema), (0, validate_1.catchError)(admin_controller_1.default.updateHotelByAdmin));
exports.default = router;
