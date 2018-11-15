var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
var Order = require("../models/order");
var passport = require("passport");
var mongoose = require("mongoose");






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
            console.log(req.body.amount);
            console.log(req.body.product_id);
            res.redirect("back");
        } else {
            console.log(req.body.amount);
            console.log(req.body.product_id);
            res.redirect(req.get("referer"));
        }
    })
});

router.get("/thankyou/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("shoppingcart").exec(function (error, foundUser) {

        if (error) {
            console.log(error)
        }
        else {

            res.render("purchases/thankyou", { User: foundUser })
        }
    });
});

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

        if (error) {
            console.log(error)
        }
        else {

            res.render("purchases/purchase", { User: foundUser })
        }
    });
    
});

router.post("/purchase/order", function (req, res) {
    Order.create(new Order({
        targetUser: req.body.username,
        amount: req.body.amount,
        orderedProducts: req.body.product_id,
        orderedProductsName: req.body.name
    }));
    

    //User.findByIdAndUpdate(req.body.user_id, { $set: { shoppingcart: [] }, $set: { amount: [] } }, function (err, newProd) {
    //    if (err) {
    //        console.log(err)
    //    }
    //});
    
    res.redirect(/thankyou/ + req.body.user_id);
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