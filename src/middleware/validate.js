"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.checkParamsId = exports.checkUser = exports.validateRequest = exports.catchError = exports.KeyHeader = void 0;
const httpCode_1 = require("@/utils/httpCode");
const reasonPhrases_1 = require("@/utils/reasonPhrases");
const mongoose_1 = require("mongoose");
const utils_1 = require("@/helpers/utils");
const keyStore_service_1 = __importDefault(require("@/services/keyStore.service"));
const user_service_1 = __importDefault(require("@/services/user.service"));
const tokenUtil_1 = __importDefault(require("@/utils/tokenUtil"));
var KeyHeader;
(function (KeyHeader) {
    KeyHeader["USER_ID"] = "x-client-id";
    KeyHeader["REFRESH_TOKEN"] = "x-rtoken-id";
    KeyHeader["ACCESS_TOKEN"] = "x-atoken-id";
})(KeyHeader = exports.KeyHeader || (exports.KeyHeader = {}));
const catchError = (fun) => {
    return (req, res, next) => {
        Promise.resolve(fun(req, res, next)).catch(next);
    };
};
exports.catchError = catchError;
// check data in request
const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    }
    catch (error) {
        error.httpCode = httpCode_1.HttpCode.BAD_REQUEST;
        error.errorType = reasonPhrases_1.ReasonPhrases.BAD_REQUEST;
        next(error);
    }
};
exports.validateRequest = validateRequest;
// check header have info need to use some router
const checkUser = async (req, _res, next) => {
    const userId = req.headers[KeyHeader.USER_ID];
    const accessToken = req.headers[KeyHeader.ACCESS_TOKEN];
    const ip = req.ip;
    try {
        if (!userId)
            throw new utils_1.BadRequestError('Header must have userId');
        if (!accessToken)
            throw new utils_1.BadRequestError('Header must have access token');
        if (!mongoose_1.Types.ObjectId.isValid(userId))
            throw new utils_1.BadRequestError('UserId wrong');
        const userDb = await user_service_1.default.findById(userId);
        if (!userDb || !userDb.isActive)
            throw new utils_1.NotFoundError('User not exit');
        const tokenStore = await keyStore_service_1.default.findOne({
            userId,
            deviceId: ip,
        });
        if (!tokenStore) {
            // userDb.isActive = false;
            // await userDb.save();
            // await KeyStoresService.deleteALlTokenStores({ userId });
            throw new utils_1.ForbiddenError('Your account is blocked, contact supporter');
        }
        const data = tokenUtil_1.default.verifyToken(accessToken, tokenStore.secretKey);
        if (!data) {
            throw new utils_1.ForbiddenError('Wrong access token');
        }
        req.user = data;
        req.user.name = userDb.name;
        req.next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkUser = checkUser;
const checkParamsId = (req, _res, next) => {
    var _a, _b;
    if (!((_a = req.params) === null || _a === void 0 ? void 0 : _a.id) || !mongoose_1.Types.ObjectId.isValid((_b = req.params) === null || _b === void 0 ? void 0 : _b.id))
        throw new utils_1.NotFoundError('Params must have id');
    next();
    try {
    }
    catch (error) {
        next(error);
    }
};
exports.checkParamsId = checkParamsId;
const checkRole = (role) => (req, _res, next) => {
    if (req.user.role !== role)
        throw new utils_1.NotAuthorizedError('you are not authorized');
    next();
    try {
    }
    catch (error) {
        next(error);
    }
};
exports.checkRole = checkRole;
