var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose")
var uniqueValidator         = require('mongoose-unique-validator');

var ProductSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    ingredients: [String],
    allergy: [String],
    price: String,
    category: String,
    amountbought: String
});

module.exports = mongoose.model("Product", ProductSchema);

