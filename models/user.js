var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose")
var uniqueValidator         = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
    role: {type: String, value:"Admin"},
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    name: {type: String, required: [true, "can't be blank"]},
    surname: {type: String, required: [true, "can't be blank"]},
    password: String,
    phonenumber: String,
    address: {
        street: String,
        number: String, 
        zipcode:String, 
        city: String
    },
    favorite:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    shoppingcart:[String]
});


UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);