"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_controller_1 = __importDefault(require("@/controllers/review.controller"));
const validate_1 = require("@/middleware/validate");
const review_schema_1 = require("@/schema/review.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @create review (parent, children)
 * @update author review (parent)
 * @get    get review hotels or review of children
 */
router.get('/', (0, validate_1.validateRequest)(review_schema_1.getReviewsSchema), (0, validate_1.catchError)(review_controller_1.default.getReviews));
router.use(validate_1.checkUser);
router.get('/user', (0, validate_1.validateRequest)(review_schema_1.getReviewsByUserSchema), (0, validate_1.catchError)(review_controller_1.default.getReviewsByUser));
router.post('/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(review_schema_1.createReviewSchema), (0, validate_1.catchError)(review_controller_1.default.createReview));
router.put('/:id', validate_1.checkParamsId, (0, validate_1.validateRequest)(review_schema_1.updateReviewSchema), (0, validate_1.catchError)(review_controller_1.default.updateReview));
exports.default = router;
