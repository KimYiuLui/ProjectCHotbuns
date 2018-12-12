var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
var Order = require("../models/order");
var Coupon = require("../models/coupon");
var passport = require("passport");
var mongoose = require("mongoose");
var nodemailer = require('nodemailer');

var noLayout, withLayout, emailHtml, mailOptions
var orderDict = {
    userFirstname,
    

} 


// x = allProductIds, i = de for loop teller. y = amount DIT VERANDERD DE HOEVEELHEDEN IN DE DATABASE BIJ product.amountbought.
// DIT WERKT DOOR MIDDEL VAN GOED GELUK DUS AUB NIET AANRAKEN.
function modifyAmountbought(i, x, y) {

    var productArray = x[i - 1]
    var newAmount = 0

    Product.findById(productArray, function (err, product) {
        console.log("Number 2 " + productArray)
        amountSearch = y[i - 1]

        newAmount = parseInt(product.amountbought) + parseInt(amountSearch.charAt(0))
        console.log(product.amountbought + " " + newAmount)
        AddinDatabase = newAmount.toString
        Product.findByIdAndUpdate(product._id, { $set: { amountbought: newAmount.toString() } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            } else {
                console.log("Number 3 " + updateAmount.amountbought)
            }
        })
    })
}

// Plaats order, maakt er eentje aan met data gegeven van account + website.
router.post("/purchase/order", function (req, res) {

    var allProductIds = req.body.product_id
    for (i = allProductIds.length; i > 0; i--) {

        modifyAmountbought(i, allProductIds, res.locals.currentUser.amount)
    }
 

    Order.create(new Order({
        targetUser: req.body.username,
        amount: req.body.amount,
        orderedProducts: req.body.product_id,
        orderedProductsName: req.body.name,
        price: req.body.price,
        status: "afwachting van betaling"
    }));

    // Voor de email opmaak. Zet alles onder elkaar.
    var notArray = []
    noLayout = req.body.name
    withLayout = ""
    console.log(Array.isArray(req.body.name))
    
    if(Array.isArray(req.body.name) == false){
        notArray.push(req.body.name)
        notArray.forEach(function (element) {
            withLayout =  withLayout + "-   " + element + " <br />"
        })
    }
    if(Array.isArray(req.body.name) == true){
        noLayout.forEach(function (element) {
            withLayout =  withLayout + "-   " + element + " <br />"
        })
    } 
    console.log(noLayout)

// De email zelf.
    emailHtml = "<a> Beste " + res.locals.currentUser.name + " " + res.locals.currentUser.surname + ", <br /> <br /> <a> <a> Bedankt dat u heeft gekozen voor HotBuns! <a> <br /> <br /> <a> Overzicht van de bestelling: <br /> " + withLayout + "<br /> <a> Wij hopen u snel terug te zien voor een volgende bestelling! <a> <br />  <br /> <a> Met vriendelijke groet, <br /><br /> HotBuns <a>"
    mailOptions = {
        from: 'hotbunsemail@gmail.com',
        to: req.body.email,
        subject: 'Uw bestelling bij HotBuns',
        html: emailHtml
    };

// Stuurt de email + laat zien of het gelukt is.
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
// Laat de thankyou pagina zien + alle benodigde gegevens.
    User.findById(req.body.user_id).populate("shoppingcart").exec(function (error, foundUser) {
        console.log(req.body.couponStatus)
        console.log(req.body.couponpriceModifierValue)
        res.render("purchases/thankyou", { User: foundUser, couponStatus: req.body.couponStatus, couponpriceModifierValue: req.body.couponpriceModifierValue })

    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;