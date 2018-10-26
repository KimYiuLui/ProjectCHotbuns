var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
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

    User.findByIdAndUpdate(req.body.user_id, { $push: { shoppingcart: req.body.product_id } }, function (err, newfav) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect(req.get("referer"));
        }
    })
});

router.put("/shoppingcart/delete", function (req, res) {
    User.findByIdAndUpdate(req.body.user_id, { $pull: { shoppingcart: { $in: req.body.product_id } } }, function (err, removefav) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect(req.get("referer"));
        }
    })
});

router.get("/purchase", function (req, res) {
    Product.find({ category: "koek" }, function (error, allBrood) {
        if (error) {
            console.log(error)
            res.redirect("/")
        }
        else {
            res.render("purchases/purchase", { product: allBrood });
        }
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;