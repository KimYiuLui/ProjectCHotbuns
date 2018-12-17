// require dependencies 
var express         = require("express");
var app             = express();
var debug           = require('debug');
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var passport        = require("passport");
var Localstrategy   = require("passport-local");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");
var session         = require('express-session')

//require Models 
var User            = require("./models/user")

//require Routes
var indexRoutes     = require("./routes/index");
var productsRoutes  = require("./routes/products");
var overigeRoutes   = require("./routes/overige");
var purchasesRoutes = require("./routes/purchases");
var UserRoutes      = require("./routes/user");
var FavoriteRoutes  = require("./routes/favorite");
var AdminRoutes     = require("./routes/admin");
var paymentRoutes = require("./routes/payment");
var statsRoutes = require("./routes/stats");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash());


mongoose.connect("mongodb://kimyiu:admin2@ds113443.mlab.com:13443/we_sell_stuff", { useNewUrlParser: true });


// passport config
app.use(session({
    secret: "e86864674c66f6b5e487bd625c1fd69bb6a7a7628daf965a8be8c1b3d4de18ffa64aa5a9b07d2f0972d13032da32b4b0e64918212c698f6ca97e53507a6f091159e346d26aa014212f4e3421c2be3f094b3f9eddf61770a239051592ec6a5acca1fbb1049187a7d53abf591e4de50dfc34ebd7a2386239def1defd98188011b0030b6c9a92f5a961c01ed6af31952951cfc32875d1059f2c2767eefd96cf3a0e7817514892715f58f4331a2634c393ddc33c1d0f7fdb6971e444ec0eb121ef8ea41e5fc8b0d7d3025f7c0c7678a2479efb8e899556ffdfc18afccd1f5e20d67eff49374d5614eac5c777bf74fc0b6bdc80a9947bd6301819234146cd95a539e3a552da9715c280bc3f59a95501de30505f9fbe11a5a5bdfc0a349f820b8c3d215841b093c259f1d057ea66619e58de6a2f0247953afc6bffd6170bd9db9527bd8694087ddedb1b120a704a65af5962f050e49770faeab5de7eabe3e3c1c89d619831f59d4424f8a078a3c3fa0d05e0cc3400b60e1cff504444c61d606e2aef0ada798db14dd77c23bbf59c39edf42bdabd6970d04600fcc73b71e5482e5d0893063ad4f9e38a5a6e97b2ad32e9c89fe22dc38998f5e9bc94db4dde9a65e00b730c303c433247cfa586471f48d6a947748edb4a4cecc1a67b6750b288b77439004571c6a0c87e23771299dedff664e5c00aa045699029c930311f1cf1e8ff262f",
    resave: false,
    saveUninitialized: false
}));

//user 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    req.body._id;
    req.body.username;
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
});

// Routes
app.use(AdminRoutes);
app.use(indexRoutes);
app.use(productsRoutes);
app.use(overigeRoutes);
app.use(purchasesRoutes);
app.use(UserRoutes);
app.use(FavoriteRoutes);
app.use(paymentRoutes);
app.use(statsRoutes);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
    console.log("Server is running ");
});

