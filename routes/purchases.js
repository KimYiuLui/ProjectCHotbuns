var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
var passport = require("passport");
var mongoose = require("mongoose");

/////ADMIN TEMP SPOT///// -Vraag ff aan kimyu of hij een route kan maken, Mij lukt het niet-
router.get("/admin/", isLoggedIn, function (req, res) {
    Product.find({}, function (error, allProducts) {
        User.find({}, function (err, allUsers) {

            if (error) {
                console.log(error)
            }
            if (err) {
                console.log(err)
            }
            else {

                res.render("admin/panel", { product: allProducts, user:allUsers })
            }
        });});
});

router.put("/admin/deleteProduct", function (req, res) {
    Product.findByIdAndRemove(req.body.product_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect(req.get("back"));
        } else {
            res.redirect(req.get("referer"));
        }
    });
}
);

router.put("/admin/deleteUser", function (req, res) {
    User.findByIdAndRemove(req.body.user_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect(req.get("back"));
        } else {
            res.redirect(req.get("referer"));
        }
    });
}
);

router.post("/admin/newUser", function (req, res) {
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        naamToevoeging: req.body.naamToevoeging,
        surname: req.body.surname,
        phonenumber: req.body.phonenumber,
        address: req.body.address
    }), req.body.password, function (error, user) {
        if (error) {
            console.log(error);
            req.flash("error", "Gebruikersnaam en/of e-mail adres bestaat al. Gebruik een andere gebruikersnaam of e-mail adres.");
            res.redirect("/admin/");
        }
        else {
            res.redirect("/admin/")
        }
        });
    
});

router.post("/admin/newProduct", function (req, res) {
    Product.create(new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image,
        ingredients: req.body.ingredients,
        allergy: req.body.allergy
    })
    )});


/////ADMIN TEMP SPOT///// -Vraag ff aan kimyu of hij een route kan maken, Mij lukt het niet-




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

router.put("/shoppingcart/add", function (req, res) {
    amountString = req.body.amount + " " + req.body.amountLink;
    console.log(amountString);
    User.findByIdAndUpdate(req.body.user_id, { $push: { shoppingcart: req.body.product_id, amount: amountString} }, function (err, newfav) {
        if (err) {
            console.log(req.body.amount);
            console.log(req.body.product_id);
            res.redirect("back");
        } else {
            console.log(req.body.amount);
            console.log(req.body.product_id);
            res.redirect(req.get("referer"));
        }
    })
});

router.put("/shoppingcart/delete", function (req, res) {
    console.log("Test 1 " + req.body.amountValue);
    console.log("Test 1 " + req.body.amountSearch);
    amountDeleteString = req.body.amountValue + " " + req.body.amountSearch;
    console.log("Test 2 " + amountDeleteString);
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

router.get("/purchase/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("shoppingcart").exec(function (error, foundUser) {

        if (error) {
            console.log(error)
        }
        else {

            res.render("purchases/purchase", { User: foundUser })
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;