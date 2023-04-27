"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const index_1 = __importDefault(require("./routes/index"));
const utils_1 = require("./helpers/utils");
const httpCode_1 = require("./utils/httpCode");
class App {
    constructor() {
        this.allowlist = ['http://localhost:5000', 'http://localhost:3000'];
        this.app = (0, express_1.default)();
        this.config();
        this.routerSetup();
    }
    config() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({ origin: this.allowlist }));
        this.app.use((0, compression_1.default)());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        require('./services/worker.service');
        require('./database/init.mongoDb');
        require('./database/init.redisDb');
    }
    routerSetup() {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        this.app.use('/', index_1.default);
        this.app.use((_res, _req, next) => {
            const err = new utils_1.NotFoundError('Not Found Url');
            next(err);
        });
        this.app.use((err, _req, res, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next) => {
            // eslint-disable-next-line no-console
            console.log('ERROR', err);
            new utils_1.SuccessResponse({
                success: false,
                statusCode: err.httpCode ? err.httpCode : httpCode_1.HttpCode.INTERNAL_SERVER_ERROR,
                errors: { message: err.message },
                message: err.isOperational ? err.errorType : 'Internal Server Error',
            }).send(res);
        });
    }
}
exports.default = new App().app;
