"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const loggers_1 = require("@/utils/loggers");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("@/config/config"));
class Database {
    constructor() {
        this.connect();
    }
    connect() {
        const logger = (0, loggers_1.getLogger)('MONGO');
        if (1 === 1) {
            mongoose_1.default.set('debug', true);
            mongoose_1.default.set('debug', { color: true });
        }
        const url = `${config_1.default.database.host}${config_1.default.database.port}${config_1.default.database.name}`;
        mongoose_1.default
            // .connect(url)
            .connect(url, { maxPoolSize: 50 }) //  nầy sau xem với tài nguyên máy tính
            .then(() => console.log('Connected Mongodb Success'))
            .catch((err) => logger.error('MongoDB Error', err));
    }
}
Database.getInstance = () => {
    if (!Database.instance) {
        Database.instance = new Database();
    }
    return Database.instance;
};
const instanceMongodb = Database.getInstance();
exports.default = instanceMongodb;
