"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const redis_1 = require("redis");
const loggers_1 = require("@/utils/loggers");
const config_1 = __importDefault(require("@/config/config"));
const { host, port, password, name } = config_1.default.redis;
const logger = (0, loggers_1.getLogger)('REDIS');
class RedisConfig {
    constructor() {
        this.connectRedis();
    }
    async connectRedis() {
        const url = `redis://${host}:${port}`;
        const client = (0, redis_1.createClient)({
            url,
            password,
            name,
        });
        client
            .connect()
            .then(() => console.log('Connected redis Success'))
            .catch((err) => logger.error('Redis Error', err));
        this.clientInstance = client;
    }
    static getInstance() {
        if (!RedisConfig.instance)
            RedisConfig.instance = new RedisConfig();
        return RedisConfig.instance.clientInstance;
    }
}
const client = RedisConfig.getInstance();
exports.default = client;
