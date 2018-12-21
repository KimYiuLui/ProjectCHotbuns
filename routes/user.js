var express     = require("express");
var router      = express.Router();
var User = require("../models/user");
var nodemailer = require('nodemailer');
var Order = require('../models/order')

var emailHtml, mailOptions, fullaname, newName;
var transporter = nodemailer.createTransport({ //setting up email account
    service: 'gmail',
    auth: {
        user: 'hotbunsemail@gmail.com',
        pass: 'Hotbuns123'
    }
});

router.get("/gebruiker/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("favorite").exec(function (error, foundUser){
        Order.find({userId: foundUser._id})
            .sort({date: 'descending'})
            .exec(function (broke, allOrders){
            if (error || broke) {
                console.log(error)
            }
            else {
                // console.log(allOrders)
                console.log(foundUser._id)  
                console.log(allOrders.userId)
                res.render("user/user", { User: foundUser, Order: allOrders })
            }
        });
    });
})

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

router.get("/gebruiker/:id/order/:id", isLoggedIn, (req, res) => {
    Order.findById(req.params.id).populate("userId").populate("orderedProducts").exec(function(error, foundOrder){
        if(error){throw error}
        var productID = foundOrder.orderedProducts._id
        var amountToArray = foundOrder.amount[0].split(",")
        res.render("orderdetail", {Order: foundOrder, amount: amountToArray, productID: productID})
    })
})


router.post("/gebruiker/:id/order/:id", (req, res) => { 
    // Voor de email opmaak. Zet alles onder elkaar.
        var amountToArray = req.params.amount
        console.log(amountToArray)
        var notArray = []
        noLayout =  amountToArray
        withLayout = ""
        console.log(req.body.orderId)
        console.log(Array.isArray(amountToArray))
        
        if(Array.isArray(amountToArray) == false){
            notArray.push( amountToArray)
            notArray.forEach(function (element) {
                withLayout =  withLayout + "-   " + element + " <br />"
            })
        }
        if(Array.isArray( amountToArray) == true){
            noLayout.forEach(function (element) {
                withLayout =  withLayout + "-   " + element + " <br />"
            })
        } 
        console.log(noLayout)

        if (req.body.additional > 0){
            fullaname = req.body.name + " " + req.body.additional + " " + req.body.surname;
        }
        else {
            fullaname = req.body.name + " " + req.body.surname;
        }

        emailHtml = "<a> Beste " + fullaname + ", <br /> <br /> <a> <a> Bedankt dat u heeft gekozen voor HotBuns! <a> <br /> <br /> <a> Overzicht van de bestelling: <br /> " + withLayout + "<br /> <a> Wij hopen u snel terug te zien voor een volgende bestelling! <a> <br />  <br /> <a> Met vriendelijke groet, <br /><br /> HotBuns <a>"
        mailOptions = {
            from: 'hotbunsemail@gmail.com',
            to: req.body.email,
            subject: 'HotBuns bestelling: ' + req.body.orderId,
            html: emailHtml
        };

    // Stuurt de email + laat zien of het gelukt is.
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.redirect(req.get("referer"))
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
module.exports = router;