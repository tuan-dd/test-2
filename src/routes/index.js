"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loggers_1 = require("@/utils/loggers");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const hotel_1 = __importDefault(require("./hotel"));
const admin_1 = __importDefault(require("./admin"));
const payment_1 = __importDefault(require("./payment"));
const review_1 = __importDefault(require("./review"));
const router = express_1.default.Router();
const logger = (0, loggers_1.getLogger)('INDEX_ROUTE');
/* GET home page. */
router.get('/', function (_req, res) {
    logger.info('hello Express');
    res.send('Welcome Backend Stay Mate Router by Tuan ');
});
router.use('/v1/api/auth', auth_1.default);
router.use('/v1/api/user', user_1.default);
router.use('/v1/api/hotel', hotel_1.default);
router.use('/v1/api/admin', admin_1.default);
router.use('/v1/api/payment', payment_1.default);
router.use('/v1/api/review', review_1.default);
exports.default = router;
