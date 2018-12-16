var express     = require("express");
var router      = express.Router();
var User = require("../models/user");
var Order = require("../models/order");

router.get("/gebruiker/:id", isLoggedIn, function (req, res) {
    Order.find({}, function (broke, allOrders) {
        User.findById(req.params.id).populate("favorite").exec(function (error, foundUser) {
            if (error || broke) {
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

router.put("/user/modifyUser", isLoggedIn, function (req, res) {
    User.findById(req.body.user_id, function (err, givenUser) {
        if (err) {
            console.log(err)
        }
        else {

            res.render("user/modifyUser", { user: givenUser })
        }
    });
});

router.post("/user/finishModifyUser", isLoggedIn, function (req, res) {
    var newName = req.body.name.slice(0); // Ducktape voor een bug.
    //Update de User. Niet het wachtwoord. "Security Reasons".
    User.findByIdAndUpdate(req.body.user_id, { $set: { email: req.body.email, name: newName, naamToevoeging: req.body.naamToevoeging, surname: req.body.surname, phonenumber: req.body.phonenumber, address: req.body.address } }, function (err, updateUser) {
        if (err) {
            console.log(err);
            res.redirect("/gebruiker/" + req.body.user_id)
        }
        else {
            console.log("No Error, Updated?");
            res.redirect("/gebruiker/" + req.body.user_id)
        }
    })
});

router.get("/user/order/:id", (req, res) => {
    
})
module.exports = router;