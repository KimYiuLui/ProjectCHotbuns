var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")
var uniqueValidator = require('mongoose-unique-validator');

var CouponSchema = new mongoose.Schema({
    couponCode: String,
    priceModifier: Number
});



module.exports = mongoose.model("Coupon", CouponSchema);

