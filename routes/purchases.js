var express = require("express");
var router = express.Router();
var Product = require("../models/product");

////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN
router.get("/shoppingcart", function (req, res) {
    Product.find({ category: "koek" }, function (error, allBrood) {
        if (error) {
            console.log(error)
            res.redirect("/")
        }
        else {
            res.render("purchases/shoppingcart", { product: allBrood });
        }
    });
})

router.get("/purchase", function (req, res) {
    Product.find({ category: "koek" }, function (error, allBrood) {
        if (error) {
            console.log(error)
            res.redirect("/")
        }
        else {
            res.render("purchases/purchase", { product: allBrood });
        }
    });
})
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;