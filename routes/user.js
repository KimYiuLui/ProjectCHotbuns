var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var Product     = require("../models/product");
var passport    = require("passport");
var mongoose        = require("mongoose");

router.get("/gebruiker/:id", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(error, foundUser){
        if(error){
            console.log(error)
        }
        else{
                    res.render("user/user", {User: foundUser})
                }
            })
        }
    );


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