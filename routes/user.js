var express     = require("express");
var router      = express.Router();
var User = require("../models/user");
var Order = require("../models/order");
var Product     = require("../models/product");
var passport    = require("passport");
var mongoose        = require("mongoose");

router.get("/gebruiker/:id", isLoggedIn, function (req, res) {
    Order.find({}, function (broke, allOrders) {
        User.findById(req.params.id).populate("favorite").exec(function (error, foundUser) {

            if (error) {
                console.log(error)
            }
            if (broke) {
                console.log(error)
            }
            else {
                res.render("user/user", { User: foundUser, Order: allOrders })
            }
        });
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