var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var nodemailer = require('nodemailer');

var host, rand, link, emailHtml, mailOptions, fullaname, newName;
var transporter = nodemailer.createTransport({ //setting up email account
    service: 'gmail',
    auth: {
        user: 'hotbunsemail@gmail.com',
        pass: 'Hotbuns123'
    }
});

//-------------------------------------
//Home and other informative pages 
//-------------------------------------
router.get("/", function (req, res) {
    res.render("home");
});

//-------------------------------------
// Register and login
//-------------------------------------
router.get("/signup", function (req, res) {
    res.render("signup", { AttemptedRegister: 0 })
});

router.post("/signup", function (req, res) {
    newName = req.body.name.slice(0, -1); // Ducktape voor een bug.
    if (req.body.password == req.body.confirm_password) {
        User.register(new User({
            active: false,
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
            else {
                if (req.body.naamToevoeging != null) {
                    fullaname = newName + " " + req.body.naamToevoeging + " " + req.body.surname;
                }
                else {
                    fullaname = newName + " " + req.body.surname;
                }
                rand = Math.floor((Math.random() * 100 + 54));
                host = req.get('host')
                link = "http://" + host + "/verify?id=" + rand;
                emailHtml = "<a> Beste " + fullaname + ",<a> <br /><br /> <a> Welkom bij Hotbuns. Hierbij bevestigen wij dat uw account succesvol is aangemaakt. <br/><a href=" + link + ">Klik deze link om je email te bevestigen<a/><br /><br /><a>Met vriendelijke groet,<a/><br/><br/> <a>HotBunsJs<a>"
                
                mailOptions = {
                    from: 'hotbunsemail@gmail.com',
                    to: req.body.email,
                    subject: 'Account bevestiging',
                    html: emailHtml
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        req.flash("error", "Er is iets misgegaan probeer nog een keer");
                        res.render("signup", { AttemptedRegister: 1, email: req.body.email, name: newName, surname: req.body.surname, Toevoeging: req.body.naamtoevoeging, phonenumber: req.body.phonenumber, city: req.body.address.city, street: req.body.address.street, zipcode: req.body.address.zipcode, housenumber: req.body.address.number, username: req.body.username })
                    } else {
                        console.log('Email sent: ' + info.response);
                        req.flash('success', 'Uw account is succesvol aangemaakt!');
                        res.redirect("/login");
                    }
                });
            }
        });
    } else {
        req.flash("error", "De opgegeven wachtwoorden zijn niet gelijk");
        res.render("signup", { AttemptedRegister: 1, email: req.body.email, name: newName, surname: req.body.surname, Toevoeging: req.body.naamtoevoeging, phonenumber: req.body.phonenumber, city: req.body.address.city, street: req.body.address.street, zipcode: req.body.address.zipcode, housenumber: req.body.address.number, username: req.body.username })
    }
});

router.get('/verify', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    // if((req.protocol+"://"+req.get('host'))==("http://"+host))
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            User.findOne({ email: mailOptions.to }, function (error, foundUser) {
                if (error) {
                    console.log(error)
                }
                else {
                    foundUser.active = true;
                    foundUser.save();
                }
            })
            console.log("email is verified")
            req.flash("success", "Uw account is nu geactiveerd.");
            res.redirect("/login")
        }
        else {
            console.log("email is not verified");
            req.flash("error", "Er is iets misgegaan tijdens het activeringsproces. Neem contact op met hotbunsemail@gmail.com");
            res.redirect("/login")
        }
    }
    else {
        req.flash("error", "Er is iets misgegaan tijdens het activeringsproces. Neem contact op met hotbunsemail@gmail.com");
        res.redirect("/login")
    }
})

router.get("/login", function (req, res) {
    res.render("login");
})


router.post("/login", passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: "Uw inlog gegevens zijn incorrect. Probeer het nog een keer."
    }), (req, res) => {
        if(req.user.active === true){
            res.redirect("/");
        }
        if(req.user.active === false){
            req.logout(); // temporary fix 
            req.flash('error', 'Uw account is nog niet geactiveerd. Controleer uw email om uw account te activeren.');
            res.redirect("/login");
        }
        req.logout();// temporary fix
        req.flash('error', 'Er is iets misgegaan probeer het nog een keer.');
        res.redirect("/login");  
})


//log out the user
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/")
});

//check if logged in 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}


//exports every router so app.js can use these routes
module.exports = router;

