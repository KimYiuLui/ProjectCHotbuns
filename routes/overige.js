var express = require("express");
var router = express.Router();

router.get("/about", function (req, res) {
    res.render("overige/about");
})

//exports every router so app.js can use these routes
module.exports = router;


router.get("/veelgesteldevragen", function (req, res) {
    res.render("overige/veelgesteldevragen");
})

//exports every router so app.js can use these routes
module.exports = router;
