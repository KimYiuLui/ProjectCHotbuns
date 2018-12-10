var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
var Order = require("../models/order");
var Coupon = require("../models/coupon");
var passport = require("passport");
var mongoose = require("mongoose");
var nodemailer = require('nodemailer');

var oldAmount, noLayout, withLayout, emailHtml, mailOptions 
 // Email gebeuren. Het emailaccount.   
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hotbunsemail@gmail.com',
        pass: 'Hotbuns123'
    }
});


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

//Voeg iets toe aan de shoppingcart. Het push de productID en hoeveelheid naar de shoppingcart stuk in de USER.
router.put("/shoppingcart/add", function (req, res) {
    amountString = req.body.amount + " " + req.body.amountLink;
    console.log(amountString);
    User.findByIdAndUpdate(req.body.user_id, { $push: { shoppingcart: req.body.product_id, amount: amountString} }, function (err, newfav) {
        if (err) {

            res.redirect("back");
        } 
        else {
            res.redirect(req.get("referer"));
        }
    })
});

//Verander hoeveelheid van een product in de shoppingcart.
router.put("/shoppingcart/modifyAmount", function (req, res) {
//Maak variabelen aan om te veranderen. Vult deze variabelen met gegeven data uit website.
    oldAmount = ""
    amountstring= ""
    oldAmount = req.body.fullamount;
// 1 van de producten + hoeveelheid word in amountString gestopt.
    amountString = req.body.amount + " " + req.body.product_id;
// In de array OldAmount word nu deze informatie gezet.
    oldAmount[parseInt(req.body.count)] = amountString;
// In database zetten, als er maar 1 product in de winkellijst zit. Hoeft hij niet te zoeken naar de goede array plek, hierdoor update hij het direct via een andere variabel..
    if (req.body.formcount == 0) {
        User.findByIdAndUpdate(req.body.user_id, { $set: { amount: amountString } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect(/shoppingcart/ + req.body.user_id);
            }

        });
    } 
    else {    // In database zetten.
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

//Verwijderen uit shopppingcart.
router.put("/shoppingcart/delete", function (req, res) {
    console.log("Test 1 " + req.body.amountValue);
    console.log("Test 1 " + req.body.amountSearch);
//Zorgen dat hij ook de hoeveelheid-data verwijderd.
    amountDeleteString = req.body.amountValue + " " + req.body.amountSearch;
    console.log("Test 2 " + amountDeleteString);
//Verwijderen van data in shoppingcart + hoeveelheid.
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
//Pagina van purchase. Dit komt na de shoppingacart, het pakt alles wat in je shoppingcart zit om nog te laten zien.
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
// Checkt of de coupon geldig is. Als het niet zo is stuurt het No, anders stuurt het Ja + de hoeveelheid korting.
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

// Plaats order, maakt er eentje aan met data gegeven van account + website.
router.post("/purchase/order", function (req, res) {
    Order.create(new Order({
        targetUser: req.body.username,
        amount: req.body.amount,
        orderedProducts: req.body.product_id,
        orderedProductsName: req.body.name
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