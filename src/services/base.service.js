"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseService {
    constructor(Model) {
        this.Model = Model;
        this.createOne = async (doc) => {
            return await this.Model.create(doc);
        };
        this.findByIdUpdate = async (id, update, option) => {
            return await this.Model.findByIdAndUpdate(id, update, {
                lean: true,
                ...option,
            }).exec();
        };
        this.updateMany = async (query, update, option) => {
            return await this.Model.updateMany(query, update, {
                lean: true,
                ...option,
            }).exec();
        };
        this.findOneUpdate = async (query, update, option) => {
            return await this.Model.findOneAndUpdate(query, update, {
                lean: true,
                ...option,
            }).exec();
        };
        this.findMany = async (query, select, option) => {
            return await this.Model.find(query.query, select, {
                lean: true,
                ...option,
            })
                .skip(query.limit * (query.page - 1))
                .limit(query.limit)
                .exec();
        };
        this.findOne = async (query, select, option) => {
            return await this.Model.findOne(query, select, {
                lean: true,
                ...option,
            }).exec();
        };
        this.findById = async (id, select, option) => {
            return await this.Model.findById(id, select, { lean: true, ...option }).exec();
        };
        this.Model = Model;
    }
}
exports.default = BaseService;
