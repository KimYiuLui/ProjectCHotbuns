var express = require("express");
var router = express.Router();
var Product = require("../models/product");

var perPage, page, koekfilter, zoetigheidfilter, broodfilter, zadenfilter, korstfilter, overigefilter
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
//------------------------------Filter Brood
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

//-------------------------------------------------------------------
//------------------------------Filter Koek
//-------------------------------------------------------------------
router.get("/koek/filter/:page", function(req, res){
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 

    if (koekfilter == "all") { koekfilter = /^/ };

    Product
    .find({category: "koek", filters: koekfilter})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(error,products){
        Product.find({category: "koek", filters: koekfilter})
            .count()
            .exec(function(error, count){
                if(error) return next(error)
                res.render("product/koekFilter",{
                    product: products, 
                    current:page, 
                    pages: Math.ceil(count / perPage)
                })
        })
    })
})


router.post("/koek/filter/:page", function (req, res) {
    perPage = req.params.perPage || 24
    page = req.params.page ||  1 
    
    koekfilter = req.body.koeksoort;
    console.log(koekfilter)

    if (koekfilter == "all") { koekfilter = /^/ };

    Product
    .find({category: "koek", filters: koekfilter})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(error,products){
        Product.find({category: "koek", filters: koekfilter})
               .count()
               .exec(function(error, count){
                   if(error) return next(error)
                   res.render("product/koekFilter",{
                    product: products, 
                    current:page, 
                    pages: Math.ceil(count / perPage)
                })
        })
    })
});


//-------------------------------------------------------------------
//------------------------------Filter Zoetigheid
//-------------------------------------------------------------------
router.get("/zoetigheid/filter/:page", function (req, res) {

    zoetigheidfilter = req.body.zoetigsoort;
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

router.post("/zoetigheid/filter/:page", function (req, res) {

    zoetigheidfilter = req.body.zoetigsoort;
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