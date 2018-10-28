var express     = require("express");
var router      = express.Router();
var User        = require("../models/user"); 
var Product     = require("../models/product");
var passport    = require("passport");
var mongoose    = require("mongoose");

router.put("/favorieten", function(req, res){

    User.findByIdAndUpdate(req.body.user_id, {$push: {favorite: req.body.product_id}} , function(err, newfav){
        if(err){
            res.redirect("back");
        } else {
            res.redirect(req.get("referer"));
        }
    })
});

router.put("/favorieten/delete", function(req,res){
    User.findByIdAndUpdate(req.body.user_id, {$pull: {favorite: {$in: req.body.product_id}}} , function(err, removefav){
        if(err){
            res.redirect("back");
        } else {
            res.redirect(req.get("referer"));
        }
    })
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};

module.exports = router;