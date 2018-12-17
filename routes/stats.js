var express = require("express");
var router = express.Router();
var Order = require("../models/order");
var Product = require("../models/product");
var User = require("../models/user");
var Coupon = require("../models/coupon");
var nodemailer = require('nodemailer');

router.get("/stats/", isLoggedIn, function (req, res) {
   
    Product.find({}).sort({ amountbought: 'descending' }).exec(function (err, product) {
        if (err) {
            console.log(err)
        }
        res.render("stats/productgraphs", { result: product, currentCategory: "" })
    });
});

router.post("/stats/filter", isLoggedIn, function (req, res) {
    if (req.body.Option == "All") {
        Product.find({}).sort({ amountbought: 'descending' }).exec(function (err, product) {
            if (err) {
                console.log(err)
            }
            res.render("stats/productgraphs", { result: product, currentCategory: "all" })
        })
    };
    if (req.body.Option == "Brood") {
        Product.find({category: 'brood'}).sort({ amountbought: 'descending' }).exec(function (err, product) {
            if (err) {
                console.log(err)
            }
            res.render("stats/productgraphs", { result: product, currentCategory: "brood" })
        })
    };
    if (req.body.Option == "Koek") {
        Product.find({category: 'koek'}).sort({ amountbought: 'descending' }).exec(function (err, product) {
            if (err) {
                console.log(err)
            }
            res.render("stats/productgraphs", { result: product, currentCategory: "koek" })
        })
    };
    if (req.body.Option == "Zoetigheid") {
        Product.find({category: 'zoetigheid'}).sort({ amountbought: 'descending' }).exec(function (err, product) {
            if (err) {
                console.log(err)
            }
            res.render("stats/productgraphs", { result: product, currentCategory: "zoetigheid"})
        })
    };
});


router.put("/stats/resetProduct", function (req, res) {
    Product.findByIdAndUpdate(req.body.product_id, { $set: { amountbought: 0 } }, function (err, updateAmount) {
        if (err) {
            console.log(err);
            res.redirect(req.get("back"));
        } else {
            res.redirect(req.get("referer"));
        }
    });
});








function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
module.exports = router;