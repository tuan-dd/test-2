"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/helpers/utils");
const sendEmail_1 = require("@/utils/sendEmail");
const crypto_1 = __importDefault(require("crypto"));
const user_service_1 = __importDefault(require("@/services/user.service"));
const pwdUtil_1 = __importDefault(require("@/utils/pwdUtil"));
const keyStore_service_1 = __importDefault(require("@/services/keyStore.service"));
const tokenUtil_1 = __importDefault(require("@/utils/tokenUtil"));
const validate_1 = require("@/middleware/validate");
const keyStore_service_2 = __importDefault(require("@/services/keyStore.service"));
const mongoose_1 = require("mongoose");
const log4js_1 = require("log4js");
const redisUtil_1 = __importDefault(require("@/utils/redisUtil"));
class AuthController {
    constructor() {
        this.signIn = async (req, res) => {
            /**
             * @check code user
             * @create createOtp
             * @save save db limit time
             * @send send code to email
             */
            const { password, email } = req.body;
            const ip = req.ip;
            const userDb = await user_service_1.default.findOne({ email });
            if (!userDb || !userDb.isActive)
                throw new utils_1.NotFoundError('User not exist');
            const comparePwd = await pwdUtil_1.default.getCompare(password, userDb.password);
            if (!comparePwd)
                throw new utils_1.ForbiddenError('Wrong password');
            const sixCode = crypto_1.default.randomInt(100000, 999999).toString();
            // const a = userDb._id.toHexString();
            const hashSixCode = await pwdUtil_1.default.getHash(sixCode.toString(), 10);
            await redisUtil_1.default.hSet(userDb._id.toHexString(), [
                'sixCode',
                hashSixCode,
                'number',
                5,
                'ip',
                ip,
            ]);
            await redisUtil_1.default.expire(userDb._id.toString(), 60 * 4);
            await (0, sendEmail_1.sendMail)(sixCode, email)
                .then(() => new utils_1.SuccessResponse({
                message: 'Send code to email successfully',
            }).send(res))
                .catch((error) => {
                (0, log4js_1.getLogger)('Send Email Error').error(error);
                throw new utils_1.BadRequestError('Can`t not send email');
            });
        };
        this.authCode = async (req, res) => {
            /**
             * @check check six code
             * @create accessToken,refreshToken,secretKey
             * @save save db
             * @send redisUtil
             */
            const { sixCode, email } = req.body;
            const ip = req.ip;
            // const idAddress_2 = req.headers['x-forwarded-for'];
            const userDb = await user_service_1.default.findOne({ email }, { password: 0 });
            if (!userDb || !userDb.isActive)
                throw new utils_1.NotFoundError('User not exist');
            if (email !== userDb.email)
                throw new utils_1.ForbiddenError('Wrong users');
            const userRedis = await redisUtil_1.default.hGetAll(userDb._id.toHexString());
            if (!userRedis)
                throw new utils_1.BadRequestError('Otp expires');
            if (userRedis.ip !== ip) {
                await redisUtil_1.default.deleteKey(userDb._id.toHexString());
                throw new utils_1.ForbiddenError('You are not in current device');
            }
            if (parseInt(userRedis.sixCode) === 0) {
                await redisUtil_1.default.deleteKey(userDb._id.toHexString());
                throw new utils_1.ForbiddenError('no guess, try sign in again');
            }
            const isValid = await pwdUtil_1.default.getCompare(sixCode.toString(), userRedis.sixCode);
            if (parseInt(userRedis.sixCode) === 1) {
                await redisUtil_1.default.deleteKey(userDb._id.toHexString());
                throw new utils_1.ForbiddenError('wrong otp and no guess, try sign in again');
            }
            if (!isValid) {
                await redisUtil_1.default.hIncrBy(userDb._id.toHexString(), 'number', -1);
                throw new utils_1.ForbiddenError(`wrong Code, you have ${parseInt(userRedis.number) - 1}`);
            }
            await redisUtil_1.default.deleteKey(userDb._id.toHexString());
            const secretKey = crypto_1.default.randomBytes(32).toString('hex');
            const { accessToken, refreshToken } = tokenUtil_1.default.createTokenPair({ email: userDb.email, role: userDb.role }, secretKey);
            // prevent duplicate same deviceId
            await keyStore_service_1.default.findOneUpdate({ userId: userDb._id, deviceId: ip }, {
                $set: {
                    refreshToken,
                    secretKey,
                },
            }, {
                new: true,
                upsert: true,
            });
            res
                .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            })
                .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            new utils_1.SuccessResponse({
                message: 'Login successfully',
            }).send(res);
        };
        this.signOut = async (req, res) => {
            const ip = req.ip;
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const objectId = new mongoose_1.Types.ObjectId(userId);
            await keyStore_service_2.default.deleteTokenStore({
                userId: objectId,
                deviceId: ip,
            });
            res
                .cookie('refreshToken', null, {
                maxAge: 0,
            })
                .cookie('accessToken', null, {
                maxAge: 0,
            });
            new utils_1.SuccessResponse({
                message: 'Sign out successfully',
            }).send(res);
        };
        this.getNewAccessToken = async (req, res) => {
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const refreshToken = req.headers[validate_1.KeyHeader.REFRESH_TOKEN];
            const ip = req.ip;
            if (!userId)
                throw new utils_1.BadRequestError('Header must have userId');
            if (!refreshToken)
                throw new utils_1.BadRequestError('Header must have access token');
            if (!mongoose_1.Types.ObjectId.isValid(userId))
                throw new utils_1.NotFoundError('UserId wrong');
            const tokenStore = await keyStore_service_2.default.findOne({
                userId,
                deviceId: ip,
            }, { lean: false });
            if (!tokenStore) {
                // userDb.isActive = false;
                // await userDb.save();
                // await KeyStoresService.deleteALlTokenStores({ userId });
                throw new utils_1.ForbiddenError('Your account is blocked, contact supporter');
            }
            if (refreshToken !== tokenStore.refreshToken) {
                throw new utils_1.ForbiddenError('Wrong refresh Token');
            }
            const payLoad = tokenUtil_1.default.verifyToken(refreshToken, tokenStore.secretKey);
            if (typeof payLoad === 'boolean')
                throw new utils_1.ForbiddenError('Wrong refresh Token');
            const newAccessToken = tokenUtil_1.default.createToken({
                email: payLoad.email,
                role: payLoad.role,
            }, tokenStore.secretKey, '3day');
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            new utils_1.SuccessResponse({
                message: 'Send new access token',
                data: newAccessToken,
            }).send(res);
        };
    }
}
const authController = new AuthController();
exports.default = authController;
