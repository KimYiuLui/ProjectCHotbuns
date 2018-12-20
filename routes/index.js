var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var nodemailer = require('nodemailer');
var Product = require("../models/product");

var host, rand, link, emailHtml, mailOptions, fullaname, newName;
var transporter = nodemailer.createTransport({ //setting up email account
    service: 'gmail',
    auth: {
        user: 'hotbunsemail@gmail.com',
        pass: 'Hotbuns123'
    }
});

//-------------------------------------
//Homepage en productcarrousel
//-------------------------------------
router.get("/", function (req, res, next) {
    var rand = Math.floor(Math.random() * Math.floor(617)) //617 = aantal producten (618 producten, maar 0 telt ook mee)
    Product
        .find().limit(12).skip(rand) //Zoekt alle producten op en skipt naar random producten toe, met een limiet van 12x (3x4 plekken in de carrousel)
        .exec(function (error, products) {
            res.render("home", {
                product: products,
            })
        })
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
                req.flash("error", "Gebruikersnaam en/of e-mailadres bestaat al. Gebruik een andere gebruikersnaam of e-mailadres.");
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
                emailHtml = "<a> Beste " + fullaname + ",<a> <br /><br /> <a> Welkom bij HotBuns! Middels deze e-mail bevestigen wij dat uw account succesvol is aangemaakt. <br/><a href=" + link + ">Klik op deze link om uw account te activeren<a/><br /><br /><a>Met vriendelijke groet,<a/><br/><br/> <a>HotBuns<a>"
                
                mailOptions = {
                    from: 'hotbunsemail@gmail.com',
                    to: req.body.email,
                    subject: 'Activeer uw account',
                    html: emailHtml
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        req.flash("error", "Er is iets misgegaan. Probeer het later nog eens");
                        res.render("signup", { AttemptedRegister: 1, email: req.body.email, name: newName, surname: req.body.surname, Toevoeging: req.body.naamtoevoeging, phonenumber: req.body.phonenumber, city: req.body.address.city, street: req.body.address.street, zipcode: req.body.address.zipcode, housenumber: req.body.address.number, username: req.body.username })
                    } else {
                        console.log('Email sent: ' + info.response);
                        req.flash('success', 'Uw account is succesvol aangemaakt! Wij hebben u een e-mail gestuurd met een activatielink.');
                        res.redirect("/login");
                    }
                });
            }
        });
    } else {
        req.flash("error", "De door u opgegeven wachtwoorden komen niet overeen.");
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
            req.flash("error", "Er is iets misgegaan tijdens het activeringsproces. Neem contact met ons op via onze Contact-pagina of probeer het later nog eens.");
            res.redirect("/login")
        }
    }
    else {
        req.flash("error", "Er is iets misgegaan tijdens het activeringsproces. Neem contact met ons op via onze Contact-pagina of probeer het later nog eens.");
        res.redirect("/login")
    }
})

router.get("/login", function (req, res) {
    res.render("login");
})


router.post("/login", passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: "Uw inloggegevens zijn incorrect."
    }), (req, res) => {
        if(req.user.active === true){
            res.redirect("/");
        }
        if(req.user.active === false){
            req.logout(); // temporary fix 
            req.flash('error', 'Uw account is nog niet geactiveerd. Controleer uw e-mail om uw account via onze bevestigingsmail te activeren.');
            res.redirect("/login");
        }
        req.logout();// temporary fix
        req.flash('error', 'Er is iets misgegaan. Probeer het later nog eens');
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