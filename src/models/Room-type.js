"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAmenities = void 0;
const mongoose_1 = require("mongoose");
// RoomType
var RoomAmenities;
(function (RoomAmenities) {
    RoomAmenities["ADDITIONAL_BATHROOM"] = "Additional bathroom";
    RoomAmenities["ADDITIONAL_TOILET"] = "Additional toilet";
    RoomAmenities["AIR_CONDITIONING"] = "Air conditioning";
    RoomAmenities["AIR_PURIFIER"] = "Air purifier";
    RoomAmenities["ALARM_CLOCK"] = "Alarm clock";
    RoomAmenities["BATHROBES"] = "Bathrobes";
    RoomAmenities["BATHROOM_PHONE"] = "Bathroom phone";
    RoomAmenities["BLACKOUT_CURTAINS"] = "Blackout curtains";
    RoomAmenities["CARBON_MONOXIDE_DETECTOR"] = "Carbon monoxide detector";
    RoomAmenities["CARPETING"] = "Carpeting";
    RoomAmenities["CLEANING_PRODUCTS"] = "Cleaning products";
    RoomAmenities["CLOSET"] = "Closet";
    RoomAmenities["CLOTHES_DRYER"] = "Clothes dryer";
    RoomAmenities["CLOTHES_RACK"] = "Clothes rack";
    RoomAmenities["COFFEE_TEA_MAKER"] = "Coffee/tea maker";
    RoomAmenities["COMPLIMENTARY_TEA"] = "Complimentary tea";
    RoomAmenities["DVD_CD_PLAYER"] = "DVD/CD player";
    RoomAmenities["DAILY_HOUSEKEEPING"] = "Daily housekeeping";
    RoomAmenities["DAILY_NEWSPAPER"] = "Daily newspaper";
    RoomAmenities["DART_BOARD"] = "Dart board";
    RoomAmenities["DESK"] = "Desk";
    RoomAmenities["DISHWASHER"] = "Dishwasher";
    RoomAmenities["DRESSING_ROOM"] = "Dressing room";
    RoomAmenities["ELECTRIC_BLANKET"] = "Electric blanket";
    RoomAmenities["EXTRA_LONG_BED"] = "Extra long bed";
    RoomAmenities["FAN"] = "Fan";
    RoomAmenities["FIRE_EXTINGUISHER"] = "Fire extinguisher";
    RoomAmenities["FIREPLACE"] = "Fireplace";
    RoomAmenities["FIRST_AID_KIT"] = "First aid kit";
    RoomAmenities["FREE_WI_FI_IN_ALL_ROOMS"] = "Free Wi-Fi in all rooms!";
    RoomAmenities["FREE_BOTTLED_WATER"] = "Free bottled water";
    RoomAmenities["FREE_INSTANT_COFFEE"] = "Free instant coffee";
    RoomAmenities["FREE_WELCOME_DRINK"] = "Free welcome drink";
    RoomAmenities["FULL_KITCHEN"] = "Full kitchen";
    RoomAmenities["HAIR_DRYER"] = "Hair dryer";
    RoomAmenities["HEATING"] = "Heating";
    RoomAmenities["HIGH_CHAIR"] = "High chair";
    RoomAmenities["HIGH_FLOOR"] = "High floor";
    RoomAmenities["HOT_TUB"] = "Hot tub";
    RoomAmenities["HUMIDIFIER"] = "Humidifier";
    RoomAmenities["IN_ROOM_SAFE_BOX"] = "In-room safe box";
    RoomAmenities["IN_ROOM_TABLET"] = "In-room tablet";
    RoomAmenities["INTERCONNECTING_ROOMS_AVAILABLE"] = "Interconnecting room(s) available";
    RoomAmenities["INTERNET_ACCESS_WIRELESS"] = "Internet access \u2013 wireless";
    RoomAmenities["IRONING_FACILITIES"] = "Ironing facilities";
    RoomAmenities["KITCHEN"] = "Kitchen";
    RoomAmenities["KITCHENWARE"] = "Kitchenware";
    RoomAmenities["LAPTOP_SAFE_BOX"] = "Laptop safe box";
    RoomAmenities["LAPTOP_WORKSPACE"] = "Laptop workspace";
    RoomAmenities["LINENS"] = "Linens";
    RoomAmenities["LOCKER"] = "Locker";
    RoomAmenities["MICROWAVE"] = "Microwave";
    RoomAmenities["MINI_BAR"] = "Mini bar";
    RoomAmenities["MIRROR"] = "Mirror";
    RoomAmenities["MOSQUITO_NET"] = "Mosquito net";
    RoomAmenities["ON_DEMAND_MOVIES"] = "On-demand movies";
    RoomAmenities["PETS_ALLOWED_IN_ROOM"] = "Pets allowed in room";
    RoomAmenities["PRIVATE_ENTRANCE"] = "Private entrance";
    RoomAmenities["REFRIGERATOR"] = "Refrigerator";
    RoomAmenities["SATELLITE_CABLE_CHANNELS"] = "Satellite/cable channels";
    RoomAmenities["SCALE"] = "Scale";
    RoomAmenities["SEATING_AREA"] = "Seating area";
    RoomAmenities["SEPARATE_DINING_AREA"] = "Separate dining area";
    RoomAmenities["SEPARATE_LIVING_ROOM"] = "Separate living room";
    RoomAmenities["SEWING_KIT"] = "Sewing kit";
    RoomAmenities["SHOESHINE_KIT"] = "Shoeshine kit";
    RoomAmenities["SHOWER"] = "Shower";
    RoomAmenities["SLIPPERS"] = "Slippers";
    RoomAmenities["SMOKE_DETECTOR"] = "Smoke detector";
    RoomAmenities["SOFA"] = "Sofa";
    RoomAmenities["SOUNDPROOFING"] = "Soundproofing";
    RoomAmenities["TV"] = "TV";
    RoomAmenities["TV_FLAT_SCREEN"] = "TV [flat screen]";
    RoomAmenities["TV_IN_BATHROOM"] = "TV [in bathroom]";
    RoomAmenities["TELEPHONE"] = "Telephone";
    RoomAmenities["TOILETRIES"] = "Toiletries";
    RoomAmenities["TOWELS"] = "Towels";
    RoomAmenities["TROUSER_PRESS"] = "Trouser press";
    RoomAmenities["UMBRELLA"] = "Umbrella";
    RoomAmenities["VENDING_MACHINE"] = "Vending machine";
    RoomAmenities["VIDEO_GAME_CONSOLE"] = "Video game console";
    RoomAmenities["WAKE_UP_SERVICE"] = "Wake-up service";
    RoomAmenities["WASHING_MACHINE"] = "Washing machine";
    RoomAmenities["WHIRLPOOL_BATHTUB"] = "Whirlpool bathtub";
    RoomAmenities["WI_FI_CHARGES_APPLY"] = "Wi-Fi [charges apply]";
    RoomAmenities["WI_FI_FREE"] = "Wi-Fi [free]";
    RoomAmenities["WIFI_PUBLIC_AREAS"] = "Wi-Fi in public areas";
    RoomAmenities["WOODEN_PARQUETED_FLOORING"] = "Wooden/parqueted flooring";
    RoomAmenities["IPOD_DOCKING_STATION"] = "iPod docking station";
})(RoomAmenities = exports.RoomAmenities || (exports.RoomAmenities = {}));
const roomTypeSchema = new mongoose_1.Schema({
    roomAmenities: [
        {
            type: String,
            required: true,
            enum: Object.values(RoomAmenities),
        },
    ],
    nameOfRoom: {
        type: String,
        required: true,
    },
    rateDescription: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    priceDiscount: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    mealType: {
        type: String,
    },
    taxType: {
        type: String,
    },
    numberOfRoom: {
        type: Number,
        required: true,
        min: 1,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
}, { timestamps: true, collection: 'roomTypes' });
const RoomType = (0, mongoose_1.model)('roomTypes', roomTypeSchema);
exports.default = RoomType;
