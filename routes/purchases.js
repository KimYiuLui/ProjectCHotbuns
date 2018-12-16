var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Coupon = require("../models/coupon");


var oldAmount, noLayout, withLayout, emailHtml, mailOptions 
 // Email gebeuren. Het emailaccount.   



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

//Voeg iets toe aan de shoppingcart. Het push de productID en hoeveelheid naar de shoppingcart stuk in de USER.
router.put("/shoppingcart/add", function (req, res) {
    amountString = req.body.amount + " " + req.body.amountLink;
    console.log(amountString);
    User.findByIdAndUpdate(req.body.user_id, { $push: { shoppingcart: req.body.product_id, amount: amountString} }, function (err, newfav) {
        if (err) {

            res.redirect("back");
        } 
        else {
            res.redirect(req.get("referer"));
        }
    })
});

//Verander hoeveelheid van een product in de shoppingcart.
router.put("/shoppingcart/modifyAmount", function (req, res) {
//Maak variabelen aan om te veranderen. Vult deze variabelen met gegeven data uit website.
    oldAmount = ""
    amountstring= ""
    oldAmount = req.body.fullamount;
// 1 van de producten + hoeveelheid word in amountString gestopt.
    amountString = req.body.amount + " " + req.body.product_id;
// In de array OldAmount word nu deze informatie gezet.
    oldAmount[parseInt(req.body.count)] = amountString;
// In database zetten, als er maar 1 product in de winkellijst zit. Hoeft hij niet te zoeken naar de goede array plek, hierdoor update hij het direct via een andere variabel..
    if (req.body.formcount == 0) {
        User.findByIdAndUpdate(req.body.user_id, { $set: { amount: amountString } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect(/shoppingcart/ + req.body.user_id);
            }

        });
    } 
    else {    // In database zetten.
        User.findByIdAndUpdate(req.body.user_id, { $set: { amount: oldAmount } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect(/shoppingcart/ + req.body.user_id);
            }
        })
    };    
});

//Verwijderen uit shopppingcart.
router.put("/shoppingcart/delete", function (req, res) {
    console.log("Test 1 " + req.body.amountValue);
    console.log("Test 1 " + req.body.amountSearch);
//Zorgen dat hij ook de hoeveelheid-data verwijderd.
    amountDeleteString = req.body.amountValue + " " + req.body.amountSearch;
    console.log("Test 2 " + amountDeleteString);
//Verwijderen van data in shoppingcart + hoeveelheid.
    User.findByIdAndUpdate(req.body.user_id, { $pull: { shoppingcart: { $in: req.body.product_id }, amount: { $in: amountDeleteString } } }, function (err, removefav) {
        if (err) {
            console.log(amountDeleteString);
            res.redirect("back");
        } else {
            console.log(amountDeleteString);
            res.redirect(req.get("referer"));
        }
    })
});
//Pagina van purchase. Dit komt na de shoppingacart, het pakt alles wat in je shoppingcart zit om nog te laten zien.
router.get("/purchase/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("shoppingcart").exec(function (error, foundUser) {
        Coupon.find({}, function (broke, allCoupons) {
            if (error) {
                console.log(error)
            }
            else {

                res.render("purchases/purchase", { User: foundUser, coupon: allCoupons, couponStatus: "noInsert" })
            }
        });
    });
    
});
// Checkt of de coupon geldig is. Als het niet zo is stuurt het No, anders stuurt het Ja + de hoeveelheid korting.
router.post("/purchase/checkCoupon", isLoggedIn, function (req, res) {
    User.findById(req.body.user_id).populate("shoppingcart").exec(function (error, foundUser) {
        Coupon.find({}, function (broke, allCoupons) {
            Coupon.findOne({ 'couponCode': req.body.givenCoupon }, function (err, priceModifier) {
                if (priceModifier == null) {
                    res.render("purchases/purchase", { User: foundUser, coupon: allCoupons, couponStatus: "No" })
                } else {
                    res.render("purchases/purchase", { User: foundUser, coupon: allCoupons, couponStatus: "Yes", couponpriceModifier: priceModifier })
                }
                console.log(priceModifier)
            });
        });
    });
});
// x = allProductIds, i = de for loop teller. y = amount DIT VERANDERD DE HOEVEELHEDEN IN DE DATABASE BIJ product.amountbought.
// DIT WERKT DOOR MIDDEL VAN GOED GELUK DUS AUB NIET AANRAKEN.

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;