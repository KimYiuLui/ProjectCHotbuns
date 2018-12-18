var express = require("express");
var router = express.Router();
var Order = require("../models/order");
var Product = require("../models/product");
var User = require("../models/user");
var Coupon = require("../models/coupon");
var Ticket = require("../models/ticket")
var nodemailer = require('nodemailer');

router.get("/help", function (req, res) {
    console.log("CURRENT USER IS " + req.user.username)
    
    Ticket.find({ email: req.user.email }, function (error, tickets) {
        console.log(tickets)
        res.render("helpdesk/help", { ticket: tickets });
    });

})

router.post("/helpdesk/sendTicket", function (req, res) {
    console.log("DE USERNAME IS = " + req.body.name);
    console.log("DE EMAIL IS = " + req.body.email);
    console.log("DE SUBJECT IS = " + req.body.subject);
    console.log("DE CONTENT IS = " + req.body.content);

    Ticket.create(new Ticket({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        content: req.body.content,
    }));
    res.redirect(req.get("referer"));
})



module.exports = router;