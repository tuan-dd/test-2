"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const config_1 = __importDefault(require("@/config/config"));
const { host, port, password, name } = config_1.default.redis;
const myQueue = new bullmq_1.Queue('myQueue', {
    connection: {
        host: host,
        port: parseInt(port),
        password,
        name,
    },
});
const addJobToQueue = async (job, option) => await myQueue.add(job.type, job, option);
exports.default = addJobToQueue;
