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
    
    Ticket.find({ email: req.user.email }).sort({ status: "descending" }).exec( function (error, tickets) {
        console.log(tickets)
        res.render("helpdesk/help", { ticket: tickets });
    });

})

router.post("/helpdesk/sendTicket", function (req, res) {
    console.log("DE USERNAME IS = " + req.body.name);
    console.log("DE EMAIL IS = " + req.body.email);
    console.log("DE SUBJECT IS = " + req.body.subject);
    console.log("DE CONTENT IS = " + req.body.content);
    var finalcontent = "Bericht van: " + req.body.name + ",\r\n\r\n" + req.body.content
    Ticket.create(new Ticket({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        content: finalcontent
    }));
    res.redirect(req.get("referer"));
})

router.post("/helpdesk/updateTicket", function (req, res) {
    console.log("DE USERNAME IS = " + req.body.name);
    console.log("DE EMAIL IS = " + req.body.email);
    console.log("DE CONTENT IS = " + req.body.content);
    var finalcontent = "Bericht van: " + req.body.name + ",\r\n\r\n" + req.body.content
    Ticket.findById(req.body.ticketId, function (error, oldContent) {
    
        Ticket.findByIdAndUpdate(req.body.ticketId, { $set: { content: finalcontent }, $push: {history: oldContent.content} }, function (error, foundTicket) {
        
            if (error) {
                console.log(error)
            }
            else {
                res.redirect(req.get("referer"));
            }
            });
    });
    
})

router.get("/help/ticket/:id", function (req, res) {
    Ticket.findById(req.params.id, function (error, foundTicket) {
        if (error) {
            console.log(error)
        }
        else {
            res.render("helpdesk/ticket", { ticket: foundTicket })
        }
    });
});

router.post("/helpdesk/closeTicket/:id", function (req, res) {
    Ticket.findByIdAndUpdate(req.params.id, { $set: { status: "Gesloten" } }, function (error, foundTicket) {
        if (error) {
            console.log(error)
        }
        else{
            res.redirect("/help");
        }
    });
});


module.exports = router;