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
router.get("/brood/filter/:page", function (req, res) {
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 

    if (broodfilter == "all") {broodfilter = /^/};
    if (zadenfilter == "allz") {zadenfilter = /^/};
    if (korstfilter == "allk") {korstfilter = /^/};
    if (overigefilter == "allo") {overigefilter = /^/};

    Product
    .find({category: "brood", $and: [{ filters: overigefilter }, { filters: zadenfilter }, { filters: korstfilter }, { filters: broodfilter }]})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(error,products){
        Product.find({category: "brood", $and: [{ filters: overigefilter }, { filters: zadenfilter }, { filters: korstfilter }, { filters: broodfilter }]})
               .count()
               .exec(function(error, count){
                   if(error) return next(error)
                   res.render("product/broodFilter",{
                    product: products, 
                    current:page, 
                    pages: Math.ceil(count / perPage)
                })
        })
    })
});

router.post("/brood/filter/:page", function (req, res) {
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 

    broodfilter = req.body.broodsoort;
    zadenfilter = req.body.zadenoptie;
    korstfilter = req.body.korstoptie;
    overigefilter = req.body.overigeoptie; 
    console.log(broodfilter, zadenfilter, korstfilter, overigefilter)

    if (broodfilter == "all") {broodfilter = /^/};
    if (zadenfilter == "allz") {zadenfilter = /^/};
    if (korstfilter == "allk") {korstfilter = /^/};
    if (overigefilter == "allo") {overigefilter = /^/};

    Product
    .find({category: "brood", $and: [{ filters: overigefilter }, { filters: zadenfilter }, { filters: korstfilter }, { filters: broodfilter }]})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(error,products){
        Product.find({category: "brood", $and: [{ filters: overigefilter }, { filters: zadenfilter }, { filters: korstfilter }, { filters: broodfilter }]})
               .count()
               .exec(function(error, count){
                   if(error) return next(error)
                   res.render("product/broodFilter",{
                    product: products, 
                    current:page, 
                    pages: Math.ceil(count / perPage)
                })
        })
    })
});

module.exports = router;