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
    var query = Product.find();
    var selection = req.body.Category;

    console.log("HUIDIGE CATEGORIE = " + req.body.Category)
    console.log("HUIDIGE OPTIE = " + req.body.Option)
    console.log("HUIDIGE FILTER = " + req.body.Filter)
    console.log("---------------------------------------")

    // Welke productegroep is gekozen
    if (req.body.Option == "Brood" || req.body.Category == "brood") {
        query.where('category').equals('brood');
    }
    else if (req.body.Option == "Koek" || req.body.Category == "koek") {
        query.where('category').equals('koek');
    }
    else if (req.body.Option == "Zoetigheid" || req.body.Category == "zoetigheid") {
        query.where('category').equals('zoetigheid');
    }
    //Welke filter is gekozen
    if (req.body.Filter == "0") {
        query.where('amountbought').equals(0);
    }
    else if (req.body.Filter == "1+") {
        query.where('amountbought').gt(0);
    }
    else if (req.body.Filter == "50+") {
        query.where('amountbought').gt(50);
    }
    else if (req.body.Filter == "100+") {
        query.where('amountbought').gt(100);
    }




    //Executeer de query
    query.sort({ amountbought: 'descending' });
    query.exec().then(product => {

        res.render("stats/productgraphs", { result: product, currentCategory: selection })
    });
});

router.post("/stats/orderFind", isLoggedIn, function (req, res) {
    var Filter = req.body.productName
    console.log("HUIDIGE PRODUCT = " + req.body.productName)
    Order.find({ orderedProductsName: { $regex: Filter } }).exec(function (err, result) {
        if (err) {
            console.log(err)
        }
        console.log("HUIDIGE RESULTAAT = " + result)
        res.render("stats/orderTable", { order: result })
        
    });
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