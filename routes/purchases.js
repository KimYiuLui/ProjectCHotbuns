var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
var Order = require("../models/order");
var Coupon = require("../models/coupon");
var passport = require("passport");
var mongoose = require("mongoose");
var nodemailer = require('nodemailer');





////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN
router.get("/shoppingcart/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("shoppingcart").exec(function (error, foundUser) {

        if (error) {
            console.log(error)
        }
        else {

            res.render("purchases/shoppingcart", { User: foundUser })
        }
    });
});


router.put("/shoppingcart/add", function (req, res) {
    amountString = req.body.amount + " " + req.body.amountLink;
    console.log(amountString);
    User.findByIdAndUpdate(req.body.user_id, { $push: { shoppingcart: req.body.product_id, amount: amountString} }, function (err, newfav) {
        if (err) {

            res.redirect("back");
        } else {

            res.redirect(req.get("referer"));
        }
    })
});

router.put("/shoppingcart/modifyAmount", function (req, res) {
    var oldAmount = ""
    amountstring= ""
    oldAmount = req.body.fullamount;
    amountString = req.body.amount + " " + req.body.product_id;

    oldAmount[parseInt(req.body.count)] = amountString;

    if (req.body.formcount == 0) {
        User.findByIdAndUpdate(req.body.user_id, { $set: { amount: amountString } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect(/shoppingcart/ + req.body.user_id);
            }

        });
    } else {


        User.findByIdAndUpdate(req.body.user_id, { $set: { amount: oldAmount } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect(/shoppingcart/ + req.body.user_id);
            }

        })
    };    
});


//router.get("/thankyou/:id", isLoggedIn, function (req, res) {
//    User.findById(req.params.id).populate("shoppingcart").exec(function (error, foundUser) {

//        if (error) {
//            console.log(error)
//        }
//        else {

//            res.render("purchases/thankyou", { User: foundUser })
//        }
//    });
//});

router.put("/shoppingcart/delete", function (req, res) {
    console.log("Test 1 " + req.body.amountValue);
    console.log("Test 1 " + req.body.amountSearch);
    amountDeleteString = req.body.amountValue + " " + req.body.amountSearch;
    console.log("Test 2 " + amountDeleteString);
    User.findByIdAndUpdate(req.body.user_id, { $pull: { shoppingcart: { $in: req.body.product_id }, amount: { $in: amountDeleteString } } }, function (err, removefav) {
        if (err) {
            console.log(amountDeleteString);
            res.redirect("back");
        } else {
            console.log(amountDeleteString);
            res.redirect(req.get("referer"));
        }
    })
});

router.get("/purchase/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("shoppingcart").exec(function (error, foundUser) {
        Coupon.find({}, function (broke, allCoupons) {
            if (error) {
                console.log(error)
            }
            else {

                res.render("purchases/purchase", { User: foundUser, coupon: allCoupons, couponStatus: "noInsert" })
            }
        });
    });
    
});

router.post("/purchase/checkCoupon", isLoggedIn, function (req, res) {
    User.findById(req.body.user_id).populate("shoppingcart").exec(function (error, foundUser) {
        Coupon.find({}, function (broke, allCoupons) {
            Coupon.findOne({ 'couponCode': req.body.givenCoupon }, function (err, priceModifier) {
                if (priceModifier == null) {
                    res.render("purchases/purchase", { User: foundUser, coupon: allCoupons, couponStatus: "No" })
                } else {
                    res.render("purchases/purchase", { User: foundUser, coupon: allCoupons, couponStatus: "Yes", couponpriceModifier: priceModifier })
                }
                console.log(priceModifier)
            });
    });
    });
});


router.post("/purchase/order", function (req, res) {
    Order.create(new Order({
        targetUser: req.body.username,
        amount: req.body.amount,
        orderedProducts: req.body.product_id,
        orderedProductsName: req.body.name
    }));
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hotbunsemail@gmail.com',
            pass: 'Hotbuns123'
        }
    });

    var emailHtml = "<a> Dank u voor het bestellen bij hotbuns. <a> <br /> <a> Uw bestelling is: " + req.body.name + "<br /> <a> Wij hopen voor een volgende bestelling! <a>"
    var mailOptions = {
        from: 'hotbunsemail@gmail.com',
        to: req.body.email,
        subject: 'Uw bestelling bij Hotbuns',
        html: emailHtml
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

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