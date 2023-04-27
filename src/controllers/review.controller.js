"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/helpers/utils");
const validate_1 = require("@/middleware/validate");
const hotels_service_1 = __importDefault(require("@/services/hotels.service"));
const review_service_1 = __importDefault(require("@/services/review.service"));
const lodashUtil_1 = require("@/utils/lodashUtil");
const mongoose_1 = require("mongoose");
class ReviewController {
    constructor() {
        /**
         * @check hotelDb check id có tìm dc Hotel
         * @check do review được tạo trước ở bullmq nên tìm kiếm review nếu k có đã quá hạn để review
         * @check check nếu chủ ks k được tạo reviews
         * @check nếu rely thi chu mới được tao
         */
        this.createReview = async (req, res) => {
            const authorId = new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]);
            const newReview = {
                context: req.body.context,
                images: req.body.images,
                starRating: req.body.starRating,
            };
            const parent_slug = req.body.parent_slug;
            const hotelId = new mongoose_1.Types.ObjectId(req.body.hotelId);
            const hotelDb = await hotels_service_1.default.findOne({ _id: hotelId }, null, {
                lean: false,
            });
            const isOwnerHotel = hotelDb.userId.equals(authorId);
            if (!hotelDb)
                throw new utils_1.NotFoundError('Not found hotel');
            const reviewDb = await review_service_1.default.findById(req.params.id, null, { lean: false });
            if (!parent_slug) {
                if (reviewDb.starRating > 0)
                    throw new utils_1.NotAuthorizedError('Review has already ');
                if (!reviewDb)
                    throw new utils_1.NotAuthorizedError('User have already expired reviews');
                if (isOwnerHotel)
                    throw new utils_1.NotAuthorizedError('Hotelier cant not reviewDb their hotel');
            }
            Object.keys(newReview).forEach((key) => {
                reviewDb[key] = newReview[key];
            });
            if (parent_slug) {
                const replyReview = (0, lodashUtil_1.getDeleteFilter)(['_id', 'createdAt', 'updatedAt', 'images'], reviewDb);
                //check nếu chủ ks k được  tạo reply
                if (!isOwnerHotel)
                    throw new utils_1.NotAuthorizedError(' Only hotelier can reply review ');
                if (parent_slug !== reviewDb.slug)
                    throw new utils_1.BadRequestError('Wrong parent slug');
                //mỗi người chỉ tạo 1 reply
                if (reviewDb.isReply)
                    throw new utils_1.BadRequestError('Review has already reply');
                replyReview.parent_slug = parent_slug;
                replyReview.slug = `${reviewDb.slug}/${new Date().getTime().toString()}`;
                const createReview = await review_service_1.default.createOne(replyReview);
                reviewDb.isReply = true;
                await reviewDb.save();
                return new utils_1.CreatedResponse({
                    message: ' Create reply successfully',
                    data: createReview,
                }).send(res);
            }
            await reviewDb.save();
            hotelDb.starRating = {
                countReview: hotelDb.starRating.countReview + 1,
                starAverage: (hotelDb.starRating.starAverage * hotelDb.starRating.countReview +
                    newReview.starRating) /
                    (1 + hotelDb.starRating.countReview),
            };
            await hotelDb.save();
            new utils_1.CreatedResponse({
                message: 'Create review successfully',
                data: reviewDb,
            }).send(res);
        };
        this.updateReview = async (req, res) => {
            /**
             * @check 'author.authorId' thì mới được sửa
             * @check có review
             */
            const { context, images, starRating, isDelete } = req.body;
            if (isDelete) {
                const newUpdate = await review_service_1.default.findOneUpdate({
                    _id: new mongoose_1.Types.ObjectId(req.params.id),
                    'author.authorId': new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]),
                }, { $set: { isDelete: true } });
                return oke(newUpdate);
            }
            const newUpdate = await review_service_1.default.findOneUpdate({
                _id: new mongoose_1.Types.ObjectId(req.params.id),
                'author.authorId': new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]),
            }, { $set: { context, images, starRating, isDelete } });
            return oke(newUpdate);
            function oke(newUpdate) {
                if (!newUpdate)
                    throw new utils_1.NotFoundError('Not found review');
                new utils_1.CreatedResponse({ message: ' Update Review successfully' }).send(res);
            }
        };
        this.getReviewsByUser = async (req, res) => {
            /**
             * @case_1 nếu k hotelId parent_slug thì lấy reviews theo 2 điều kiện đã review hoặc chưa review
             * @case_2 hotelId parent_slug
             */
            const { hotelId, statusBooking, parent_slug, isReview } = req.query;
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const userId = new mongoose_1.Types.ObjectId(req.headers[validate_1.KeyHeader.USER_ID]);
            let reviews = [];
            if (Object.keys(req.query).every((key) => !req.query[key]))
                throw new utils_1.BadRequestError('Request must have one value');
            if (statusBooking) {
                if (isReview) {
                    reviews = await review_service_1.default.findMany({
                        query: {
                            'author.authorId': userId,
                            starRating: { $gte: 0.5 },
                            parent_slug: '',
                        },
                        page: page,
                        limit: limit,
                    });
                }
                if (!isReview) {
                    reviews = await review_service_1.default.findMany({
                        query: {
                            'author.authorId': userId,
                            parent_slug: '',
                            starRating: 0,
                        },
                        page: page,
                        limit: limit,
                    });
                }
                return oke(reviews);
            }
            if (hotelId) {
                const hotelDb = await hotels_service_1.default.findById(hotelId);
                if (!hotelDb.userId.equals(userId))
                    throw new utils_1.NotAuthorizedError('Only hotelier can get hotel`s review');
                if (!parent_slug) {
                    reviews = await review_service_1.default.findMany({
                        query: {
                            'hotel.hotelId': hotelId,
                            starRating: { $gte: 0.5 },
                            parent_slug,
                        },
                        page: page,
                        limit: limit,
                    });
                }
                if (parent_slug) {
                    reviews = await review_service_1.default.findMany({
                        query: {
                            'hotel.hotelId': hotelId,
                            parent_slug: { $ne: '' },
                        },
                        page: page,
                        limit: limit,
                    });
                }
                return oke(reviews);
            }
            function oke(reviews) {
                if (!reviews)
                    throw new utils_1.NotFoundError('Not found reviews');
                new utils_1.CreatedResponse({
                    message: ' get Data`review successfully',
                    data: reviews,
                }).send(res);
            }
        };
        this.getReviews = async (req, res) => {
            const { hotelId, parent_slug } = req.query;
            const page = req.query.page || 1;
            const limit = req.body.limit || 10;
            let reviews;
            if (Object.keys(req.query).every((key) => !req.query[key]))
                throw new utils_1.BadRequestError('Request must have one value');
            if (parent_slug) {
                const regex = new RegExp(parent_slug, 'i');
                reviews = await review_service_1.default.findOne({ slug: regex });
                return oke(reviews);
            }
            if (!parent_slug) {
                reviews = await review_service_1.default.findMany({
                    query: {
                        'hotel.hotelId': hotelId,
                        starRating: { $gte: 0.5 },
                    },
                    page: page,
                    limit: limit,
                });
                return oke(reviews);
            }
            function oke(reviews) {
                if (!reviews)
                    throw new utils_1.NotFoundError('Not found reviews');
                new utils_1.CreatedResponse({
                    message: ' Get Data`s review successfully',
                    data: reviews,
                }).send(res);
            }
        };
    }
}
const reviewController = new ReviewController();
exports.default = reviewController;
