var express = require("express");
var router = express.Router();

router.get("/About", function (req, res) {
    res.render("Klantenservice/About");
})

//exports every router so app.js can use these routes
module.exports = router;
