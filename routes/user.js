var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var Product     = require("../models/product");
var passport    = require("passport");
var mongoose        = require("mongoose");

router.get("/gebruiker/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("favorite").exec(function (error, foundUser) {

        if (error) {
            console.log(error)
        }
        else {
            res.render("user/user", { User: foundUser })
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

router.post("/brood/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id,  )
 });

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};

module.exports = router;