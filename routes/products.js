var express = require("express");
var router = express.Router();
var Product = require("../models/product");

var perPage, page
//-------------------------------------------------------------------
//-------------------------------BROOD
//-------------------------------------------------------------------
router.get("/brood/:page", function(req, res, next){
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 
    Product
        .find({category: "brood"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(error,products){
            Product.find({category: "brood"})
                   .count()
                   .exec(function(error, count){
                       if(error) return next(error)
                       res.render("product/brood",{
                        product: products, 
                        current:page, 
                        pages: Math.ceil(count / perPage)
                    })
            })
    })
})

//-------------------------------------------------------------------
//-------------------------------KOEK
//-------------------------------------------------------------------
router.get("/koek/:page", function(req, res, next){
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 
    Product
        .find({category: "koek"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(error,products){
            Product.find({category: "koek"})
                   .count()
                   .exec(function(error, count){
                       if(error) return next(error)
                       res.render("product/koek",{
                        product: products, 
                        current:page, 
                        pages: Math.ceil(count / perPage)
                       })
                   })
        })
});

//-------------------------------------------------------------------
//-------------------------------Zoetigheid
//-------------------------------------------------------------------
router.get("/zoetigheid/:page", function(req, res){
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 
    Product
        .find({category: "zoetigheid"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(error,products){
            Product.find({category: "zoetigheid"})
                   .count()
                   .exec(function(error, count){
                       if(error) return next(error)
                       res.render("product/zoetigheid",{
                        product: products, 
                        current:page, 
                        pages: Math.ceil(count / perPage)
                       })
                   })
        })
});

//-------------------------------------------------------------------
//------------------------------Detail Page
//-------------------------------------------------------------------

router.get("/:category/detail/:id", function(req, res){
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
//------------------------------Filter
//-------------------------------------------------------------------
router.post("/brood/:page", function (req, res) {

    var broodfilter = req.body.broodsoort;
    var zadenfilter = req.body.zadenoptie;
    var korstfilter = req.body.korstoptie;
    var overigefilter = req.body.overigeoptie;
    console.log(broodfilter, zadenfilter, korstfilter, overigefilter)

    if (broodfilter == "all") {broodfilter = /^/};
    if (zadenfilter == "allz") {zadenfilter = /^/};
    if (korstfilter == "allk") {korstfilter = /^/};
    if (overigefilter == "allo") {overigefilter = /^/};

    Product.find({
        category: "brood", $and: [{ filters: overigefilter }, { filters: zadenfilter }, { filters: korstfilter }, { filters: broodfilter }] }, function (error, filteredProduct) {
        if (error) {
            console.log(error)
        }
        else {
            res.render("product/broodFilter", { product: filteredProduct })
        }
    });
});

router.post("/koek/:page", function (req, res) {

    var koekfilter = req.body.koeksoort;
    console.log(koekfilter)

    if (koekfilter == "all") { koekfilter = /^/ };

    Product.find({
        category: "koek", filters: koekfilter
    }, function (error, filteredProduct) {
        if (error) {
            console.log(error)
        }
        else {
            res.render("product/koekFilter", { product: filteredProduct })
        }
    });
});

router.post("/zoetigheid/:page", function (req, res) {

    var zoetigheidfilter = req.body.zoetigsoort;
    console.log(zoetigheidfilter)

    if (zoetigheidfilter == "all") { zoetigheidfilter = /^/ };

    Product.find({
        category: "zoetigheid", filters: zoetigheidfilter
    }, function (error, filteredProduct) {
        if (error) {
            console.log(error)
        }
        else {
            res.render("product/zoetigheidFilter", { product: filteredProduct })
        }
    });
});
module.exports = router;