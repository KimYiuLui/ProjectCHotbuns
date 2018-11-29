var express = require("express");
var router = express.Router();
var Product = require("../models/product");

//-------------------------------------------------------------------
//-------------------------------BROOD
//-------------------------------------------------------------------
router.get("/brood", function(req, res){
    Product.find({ category: "brood" }, function (error, allBrood) {
        if (error) {
            console.log(error)
            res.redirect("/")
        }
        else {
            res.render("product/category", { product: allBrood });
        }
    });
});

router.get("/brood/:id", function(req, res){
    Product.findById(req.params.id, function(error, foundProduct){
        if(error){
            console.log(error)
        }
        else{
            res.render("product/product", {product: foundProduct})
        }
    });
});

//-------------------------------------------------------------------
//-------------------------------KOEK
//-------------------------------------------------------------------
router.get("/koek", function(req, res){
    Product.find({category: "koek"}, function(error, allKoek){
        if(error){
            console.log(error)
            res.redirect("/")
        }
        else{
            res.render("product/category", {product: allKoek});
        }
    });
});

router.get("/koek/:id", function(req, res){
    Product.findById(req.params.id, function(error, foundProduct){
        if(error){
            console.log(error)
        }
        else{
            res.render("product/product", {product: foundProduct})
        }
    });
});

//-------------------------------------------------------------------
//-------------------------------Zoetigheid
//-------------------------------------------------------------------
router.get("/zoetigheid", function(req, res){
    Product.find({category: "zoetigheid"}, function(error, allZoetigheid){
        if(error){
            console.log(error)
            res.redirect("/")
        }
        else{
            res.render("product/category", {product: allZoetigheid});
        }
    });
});

router.get("/zoetigheid/:id", function(req, res){
    Product.findById(req.params.id, function(error, foundProduct){
        if(error){
            console.log(error)
        }
        else{
            res.render("product/product", {product: foundProduct})
        }
    });
});

// Filteren
router.post("/productfilter", function (req, res) {

    var broodfilter = req.body.broodsoort;
    var zadenfilter = req.body.zadenoptie;
    var korstfilter = req.body.korstoptie;
    var overigefilter = req.body.overigeoptie;

    console.log(broodfilter)
    console.log(zadenfilter)
    console.log(korstfilter)
    console.log(overigefilter)

    if (broodfilter == "all") {
        broodfilter = /^/
    };

    if (zadenfilter == "allz") {
        zadenfilter = /^/
    };

    if (korstfilter == "allk") {
        korstfilter = /^/
    };

    if (overigefilter == "allo") {
        overigefilter = /^/
    };

    Product.find({
        category: "brood", $and: [{ filters: overigefilter }, { filters: zadenfilter }, { filters: korstfilter }, { filters: broodfilter }] }, function (error, filteredProduct) {
        if (error) {
            console.log(error)
        }
        else {
            res.render("product/category", { product: filteredProduct })
        }
    });
});
module.exports = router;