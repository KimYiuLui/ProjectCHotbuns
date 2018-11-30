var express = require("express");
var router = express.Router();
var Product = require("../models/product");
//-------------------------------------------------------------------
//-------------------------------BROOD
//-------------------------------------------------------------------
function getCategory(category){
    var query = Product.find({category: category});
    return query;
};

router.get("/brood/:page", function(req, res, next){
    var perPage = 24
    var page = req.params.page ||  1 
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


router.get("/brood/detail/:id", function(req, res){
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
router.get("/koek/:page", function(req, res, next){
    var perPage = 24
    var page = req.params.page ||  1 
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

router.get("/koek/detail/:id", function(req, res){
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
router.get("/zoetigheid/:page", function(req, res){
    var perPage = 24
    var page = req.params.page ||  1 
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

router.get("/zoetigheid/detail/:id", function(req, res){
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
router.post("/brood/:page", function (req, res) {

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
            res.render("product/brood", { product: filteredProduct })
        }
    });
});


module.exports = router;