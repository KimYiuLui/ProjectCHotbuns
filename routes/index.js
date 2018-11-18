var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");

//-------------------------------------
//Home and other informative pages 
//-------------------------------------
router.get("/", function(req, res){
    res.render("home");
});

//-------------------------------------
// Register and login
//-------------------------------------
router.get("/signup", function(req, res){
    res.render("signup", { AttemptedRegister: 0 })
});

router.post("/signup", function (req, res) {
    var newName = req.body.name.slice(0, -1); // Ducktape voor een bug.
    if (req.body.password == req.body.confirm_password) {
        User.register(new User({
            username: req.body.username,
            role: "Admin",
            email: req.body.email,
            name: newName,
            naamToevoeging: req.body.naamToevoeging,
            surname: req.body.surname,
            phonenumber: req.body.phonenumber,
            address: req.body.address
        }), req.body.password, function (error, user) {
            if (error) {
                console.log(error);
                req.flash("error", "Gebruikersnaam en/of e-mail adres bestaat al. Gebruik een andere gebruikersnaam of e-mail adres.");
                res.render("signup", { AttemptedRegister: 1, email: req.body.email, name: newName, surname: req.body.surname, Toevoeging: req.body.naamtoevoeging, phonenumber: req.body.phonenumber, city: req.body.address.city, street: req.body.address.street, zipcode: req.body.address.zipcode, housenumber: req.body.address.number, username: req.body.username })
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            });
        });
    } else {
        req.flash("error", "De wachtwoorden zijn niet gelijk");
        res.render("signup", { AttemptedRegister: 1, email: req.body.email, name: newName, surname: req.body.surname, Toevoeging: req.body.naamtoevoeging, phonenumber: req.body.phonenumber, city: req.body.address.city, street: req.body.address.street, zipcode: req.body.address.zipcode, housenumber: req.body.address.number, username: req.body.username })
    }
});


router.get("/login", function(req, res){
    res.render("login");
})


router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: "Uw inlog gegevens zijn niet correct. Probeer het nog een keer."
    }),function(req, res){
})

//log out the user
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/")
});

//check if logged in 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}


//exports every router so app.js can use these routes
module.exports = router;

