"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SecretKeyStore_1 = __importDefault(require("@/models/SecretKeyStore"));
const base_service_1 = __importDefault(require("./base.service"));
class SecretKeyStoreService extends base_service_1.default {
    constructor() {
        super(SecretKeyStore_1.default);
        // static createStore = async (KeyStore: AnyKeys<ISecretKeyStore>) => {
        //   return await SecretKeyStore.create(KeyStore);
        // };
        // static findTokenStore = async (
        //   query: FilterQuery<ISecretKeyStore>,
        //   option?: QueryOptions,
        // ) => {
        //   return await SecretKeyStore.findOne(query, null, {
        //     lean: true,
        //     ...option,
        //   }).exec();
        // };
        this.deleteALl = async (query, option) => {
            return await SecretKeyStore_1.default.deleteMany(query, option);
        };
        // static findOneUpdateTokenStore = async (
        //   query: FilterQuery<ISecretKeyStore>,
        //   update: AnyKeys<ISecretKeyStore>,
        // ) => {
        //   return await SecretKeyStore.findOneAndUpdate(
        //     query,
        //     {
        //       $set: update,
        //     },
        //     { upsert: true, new: true },
        //   ).exec();
        // };
        this.deleteTokenStore = async (query, option) => {
            return await SecretKeyStore_1.default.deleteOne(query, option).exec();
        };
    }
}
exports.default = new SecretKeyStoreService();
