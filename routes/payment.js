var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");
var Order = require("../models/order");
var nodemailer = require('nodemailer');
var paypal = require('paypal-rest-sdk');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hotbunsemail@gmail.com',
        pass: 'Hotbuns123'
    }
});

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AR7cV16fntmKTqaXi8fgPG4SYTGoKItUjRTZ6hOOZMtO33MaZ94RQfOg_9Pay6WwNpy4cp_yEqaPVbzm',
    'client_secret': 'ENaW1JIVm0cUQgLJMGZmTosNy1sNG5xgE0NOAWsM35hd35ABFcPvY6ZVG6MijWDljAOXptidmcErhQYk'
  });

var noLayout, withLayout, emailHtml, mailOptions, allProductIds, userAmount, Username, userFirstname,userAdditionals,userSurname,userEmail,productAmount,orderedProducts,orderedProductsName, price, status, couponStatus, couponpriceModifierValue, UserId, intPrice, productArray,amountSearch




// x = allProductIds, i = de for loop teller. y = amount DIT VERANDERD DE HOEVEELHEDEN IN DE DATABASE BIJ product.amountbought.
// DIT WERKT DOOR MIDDEL VAN GOED GELUK DUS AUB NIET AANRAKEN.
function modifyAmountbought(i, x, y) {
    if(Array.isArray(x) == false){
        productArray = x
    }
    if(Array.isArray(x) == true){
        productArray = x[i - 1]
    } 
    console.log(noLayout)
    
    var newAmount = 0

    Product.findById(productArray, function (err, product) {
        console.log("Number 2 " + productArray)
        if(Array.isArray(y) == false){
            amountSearch = y[i - 1]
            newAmount = parseInt(product.amountbought) + parseInt(amountSearch.charAt(0))
        }
        if(Array.isArray(y) == true){
            amountSearch = y[i - 1]
            newAmount = parseInt(product.amountbought) + parseInt(amountSearch.charAt(0))
            console.log(product.amountbought + " " + newAmount)
        } 
        
var stringArray = test.split(",");
return stringArray[0]
        
        AddinDatabase = newAmount.toString
        Product.findByIdAndUpdate(product._id, { $set: { amountbought: newAmount.toString() } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            } else {
                console.log("Number 3 " + updateAmount.amountbought)
            }
        })
    })
}

// Plaats order, maakt er eentje aan met data gegeven van account + website.
router.post("/purchase/order", function (req, res) {

    UserId = res.locals.currentUser._id;
    Username = req.body.username
    userFirstname = res.locals.currentUser.name
    userAdditionals = res.locals.currentUser.naamToevoeging
    userSurname = res.locals.currentUser.surname
    userEmail = req.body.email

    productAmount = req.body.amount
    orderedProducts =  req.body.product_id
    orderedProductsName = req.body.name
    price = req.body.price
    status = "Afwachting van betaling"
    
    intPrice = parseInt(price).toFixed(2)

    couponStatus = req.body.couponStatus
    couponpriceModifierValue = req.body.couponpriceModifierValue

    allProductIds = req.body.product_id,
    userAmount = res.locals.currentUser.amount

    Order.create(new Order({
        targetUser: Username,
        amount: productAmount,
        orderedProducts: orderedProducts,
        orderedProductsName: orderedProductsName,
        price: price,
        status: status
    }));

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/betaling/succes",
            "cancel_url": "http://localhost:3000/bataling/mislukt"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "HotBuns Order",
                    "sku": "2018",
                    "price": intPrice,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": intPrice
            },
            "description": "Beste Brood van Nederland voor meer dan 2500 jaar"
        }]
    }
    
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              res.redirect(payment.links[i].href);
            }
          }
      }
    });
});


router.get('/betaling/succes', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "EUR",
              "total": intPrice
          }
      }]
    };

    // Voor de email opmaak. Zet alles onder elkaar.
    var notArray = []
    noLayout =  orderedProducts
    withLayout = ""
    console.log(Array.isArray(orderedProducts))
    
    if(Array.isArray(orderedProducts) == false){
        notArray.push( orderedProducts)
        notArray.forEach(function (element) {
            withLayout =  withLayout + "-   " + element + " <br />"
        })
    }
    if(Array.isArray( orderedProducts) == true){
        noLayout.forEach(function (element) {
            withLayout =  withLayout + "-   " + element + " <br />"
        })
    } 
    console.log(noLayout)

    if (req.body.naamToevoeging != null) {
        fullaname = userFirstname + " " + userAdditionals + " " + userSurname;
    }
    else {
        fullaname = userFirstname + " " + userSurname;
    }
// De email zelf.
    emailHtml = "<a> Beste " + fullaname + ", <br /> <br /> <a> <a> Bedankt dat u heeft gekozen voor HotBuns! <a> <br /> <br /> <a> Overzicht van de bestelling: <br /> " + withLayout + "<br /> <a> Wij hopen u snel terug te zien voor een volgende bestelling! <a> <br />  <br /> <a> Met vriendelijke groet, <br /><br /> HotBuns <a>"
    mailOptions = {
        from: 'hotbunsemail@gmail.com',
        to: req.body.email,
        subject: 'Uw bestelling bij HotBuns',
        html: emailHtml
    };

// Stuurt de email + laat zien of het gelukt is.
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    if(allProductIds.length > 1){
        for (i = allProductIds.length; i > 1; i--) {

            modifyAmountbought(i, allProductIds, userAmount)
        }
    }
    else{
        modifyAmountbought(allProductIds.length, allProductIds, userAmount)
    }
    

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } 
        else {
            console.log(JSON.stringify(payment));
            User.findById(UserId).populate("shoppingcart").exec(function (error, foundUser) {
                if(error){throw error}
                console.log(couponStatus)
                console.log(couponpriceModifierValue)
                res.render("purchases/thankyou", { User: foundUser, couponStatus: couponStatus, couponpriceModifierValue: couponpriceModifierValue })
            })
        }
    })  
})

router.get('/bataling/mislukt', (req, res) => res.send('Cancelled'));

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;