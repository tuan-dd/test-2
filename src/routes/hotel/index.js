"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotel_controller_1 = __importDefault(require("@/controllers/hotel.controller"));
const validate_1 = require("@/middleware/validate");
const User_1 = require("@/models/User");
const hotel_schema_1 = require("@/schema/hotel.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @Admin send new pass(random)to email user
 * block user
 * see all user ( cant not see money,password)
 * @user can see all my account
 */
router.get('/', (0, validate_1.validateRequest)(hotel_schema_1.getHotelSchema), (0, validate_1.catchError)(hotel_controller_1.default.getHotels));
router.get('/:id', validate_1.checkParamsId, (0, validate_1.catchError)(hotel_controller_1.default.detailHotel));
router.use(validate_1.checkUser);
router.post('/create-hotel', (0, validate_1.validateRequest)(hotel_schema_1.createHotelSchema), (0, validate_1.catchError)(hotel_controller_1.default.createHotel));
// hotelier can use router
router.use((0, validate_1.checkRole)(User_1.Role.HOTELIER));
router.put('/update-hotel/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(hotel_schema_1.updateHotelSchema), (0, validate_1.catchError)(hotel_controller_1.default.updateHotel));
router.post('/create-room/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(hotel_schema_1.createRoomSchema), (0, validate_1.catchError)(hotel_controller_1.default.createRoom));
router.put('/update-room/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(hotel_schema_1.updateRoomSchema), (0, validate_1.catchError)(hotel_controller_1.default.updateRoomType));
exports.default = router;
