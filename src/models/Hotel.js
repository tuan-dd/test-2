"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricePackage = exports.Package = exports.PropertyType = void 0;
const mongoose_1 = require("mongoose");
var PropertyType;
(function (PropertyType) {
    PropertyType["HOTEL"] = "hotel";
    PropertyType["HOLIDAY_PARKS"] = "holiday_parks";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
var Package;
(function (Package) {
    Package["FREE"] = "FREE";
    Package["WEEK"] = "WEEK";
    Package["MONTH"] = "MONTH";
    Package["YEAR"] = "YEAR";
})(Package = exports.Package || (exports.Package = {}));
var PricePackage;
(function (PricePackage) {
    PricePackage[PricePackage["FREE"] = 0] = "FREE";
    PricePackage[PricePackage["WEEK"] = 7] = "WEEK";
    PricePackage[PricePackage["MONTH"] = 30] = "MONTH";
    PricePackage[PricePackage["YEAR"] = 365] = "YEAR";
})(PricePackage = exports.PricePackage || (exports.PricePackage = {}));
const hotelSchema = new mongoose_1.Schema({
    hotelName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    zipCode: {
        type: Number,
        required: true,
        min: 999,
    },
    propertyType: {
        type: String,
        required: true,
        enum: Object.values(PropertyType),
    },
    star: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
    },
    starRating: {
        countReview: { type: Number, default: 0, required: true },
        starAverage: { type: Number, default: 5, required: true },
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90,
    },
    longitude: {
        type: Number,
        min: -180,
        max: +180,
    },
    package: {
        type: String,
        default: Package.FREE,
        require: true,
        enum: Object.values(Package),
    },
    roomTypeIds: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'roomTypes',
            min: 1,
            required: true,
        },
    ],
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'users',
        required: true,
    },
    isDelete: { type: Boolean, default: false, required: true },
}, {
    timestamps: true,
    collection: 'hotels',
});
const Hotel = (0, mongoose_1.model)('hotels', hotelSchema);
exports.default = Hotel;
