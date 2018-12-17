var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")
var uniqueValidator = require('mongoose-unique-validator');


var OrderSchema = new mongoose.Schema({
    _id: Number,
    targetUser: String,
    orderedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    status: String,
    orderedProductsName: [String],
    amount: [String],
    date:  { type: Date, default: Date.now },
    price: String
});

module.exports = mongoose.model("Order", OrderSchema);

