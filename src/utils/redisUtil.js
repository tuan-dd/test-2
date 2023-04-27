"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_redisDb_1 = __importDefault(require("@/database/init.redisDb"));
// set key many time
const set = async (key, value, options) => {
    return init_redisDb_1.default.set(key, value, options);
};
const setOne = async (key, value) => {
    return init_redisDb_1.default.setNX(key, value);
};
// get key and value
const get = async (key) => {
    return init_redisDb_1.default.get(key);
};
// set pairs key value
const hSet = async (key, value) => {
    return init_redisDb_1.default.hSet(key, value);
};
const hGetAll = async (key) => {
    return init_redisDb_1.default.hGetAll(key);
};
// up down number in hash
const hIncrBy = async (key, field, number) => {
    return init_redisDb_1.default.hIncrBy(key, field, number);
};
const incrBy = async (key, number) => {
    return init_redisDb_1.default.incrBy(key, number);
};
const decrBy = async (key, number) => {
    return init_redisDb_1.default.decrBy(key, number);
};
// limit time delete key value
const expire = async (key, value) => {
    return init_redisDb_1.default.expire(key, value);
};
const deleteKey = async (key) => {
    return init_redisDb_1.default.del(key);
};
const getTimeExpires = async (key) => {
    return init_redisDb_1.default.ttl(key);
};
exports.default = {
    set,
    get,
    hGetAll,
    hIncrBy,
    setOne,
    hSet,
    expire,
    deleteKey,
    getTimeExpires,
    incrBy,
    decrBy,
};
