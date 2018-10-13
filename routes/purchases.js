var express = require("express");
var router = express.Router();


////TEST////
router.get("/shoppingcart", function (req, res) {
    res.render("purchases/shoppingcart");
})
////TEST////

//exports every router so app.js can use these routes
module.exports = router;