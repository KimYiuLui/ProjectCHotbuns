var express = require("express");
var router = express.Router();

router.get("/about", function (req, res) {
    res.render("overige/about");
})


router.get("/veelgesteldevragen", function (req, res) {
    res.render("overige/veelgesteldevragen");
})

router.get("/contact", function (req, res) {
    res.render("overige/contact");
})

//exports every router so app.js can use these routes
module.exports = router;