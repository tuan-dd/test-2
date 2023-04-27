"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/helpers/utils");
const validate_1 = require("@/middleware/validate");
const user_service_1 = __importDefault(require("@/services/user.service"));
const user_service_2 = __importDefault(require("@/services/user.service"));
const lodashUtil_1 = require("@/utils/lodashUtil");
class UserController {
    constructor() {
        this.createUser = async (req, res) => {
            const { email } = req.body;
            const userDb = await user_service_2.default.findOne({ email });
            if (userDb)
                throw new utils_1.BadRequestError('User exit');
            const newUser = await user_service_2.default.createOne(req.body);
            new utils_1.CreatedResponse({
                message: 'Create user successfully',
                data: (0, lodashUtil_1.getFilterData)(['_id', 'name', 'email', 'role', 'avatar'], newUser),
            }).send(res);
        };
        this.updateUser = async (req, res) => {
            const body = req.body;
            const { email } = req.user;
            const userId = req.headers[validate_1.KeyHeader.USER_ID];
            const userDb = await user_service_2.default.findByIdAndCheckPass(userId, body.password, {
                lean: true,
            });
            if (typeof userDb === 'boolean')
                throw new utils_1.ForbiddenError('Wrong Password');
            if (email === userDb.email)
                throw new utils_1.ForbiddenError('Wrong Email');
            Object.keys(body).forEach((key) => {
                userDb[key] = body[key];
            });
            await userDb.save();
            new utils_1.SuccessResponse({
                message: 'update user successfully',
            }).send(res);
        };
        this.getMe = async (req, res) => {
            const dataUser = await user_service_1.default.findOne({});
            new utils_1.SuccessResponse({
                message: 'update user successfully',
                data: dataUser,
            }).send(res);
        };
    }
}
const userController = new UserController();
exports.default = userController;
