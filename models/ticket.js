var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")
var uniqueValidator = require('mongoose-unique-validator');

var TicketSchema = new mongoose.Schema({
    name: String,
    email: String,
    category: String,
    subject: String,
    content: String,
    history: [String],
    status: { type: String, default: 'Open' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", TicketSchema);

