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

var noLayout, withLayout, emailHtml, mailOptions, allProductIds, userAmount, Username, userFirstname,userAdditionals,userSurname,userEmail,productAmount,orderedProducts,orderedProductsName, price, status, couponStatus, couponpriceModifierValue, UserId, intPrice, productArray,amountSearch, OrderNumber

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
        if(Array.isArray(x) == false){
            amountSearch = y
            newAmount = product.amountbought + parseInt(JSON.stringify(amountSearch).charAt(2))
        }
        if(Array.isArray(x) == true){
            amountSearch = y[i - 1]
            newAmount = product.amountbought + parseInt(JSON.stringify(amountSearch).charAt(1))
        } 
        
        Product.findByIdAndUpdate(product._id, { $set: { amountbought: newAmount } }, function (err, updateAmount) {
            if (err) {
                console.log(err)
            } else {
                console.log("Number 3 " + updateAmount.amountbought)
            }
        })
    })
}

function AddOrdersToUser(){
    User.findByIdAndUpdate(UserId, {$push: {orders: OrderNumber}}, function(error, newOrderList){
        if(error){throw error}
        console.log(newOrderList)
    })
}


// Plaats order, maakt er eentje aan met data gegeven van account + website.
router.post("/purchase/order", function (req, res) {

    UserId = res.locals.currentUser._id
    Username = req.body.username
    userFirstname = res.locals.currentUser.name
    userAdditionals = res.locals.currentUser.naamToevoeging
    userSurname = res.locals.currentUser.surname
    userEmail = req.body.email

    productAmount = req.body.amount
    orderedProducts =  req.body.product_id
    orderedProductsName = req.body.name
    price = req.body.price
    status = "In afwachting van betaling"
    
    
    intPrice = parseInt(price).toFixed(2)

    couponStatus = req.body.couponStatus
    couponpriceModifierValue = req.body.couponpriceModifierValue

    allProductIds = req.body.product_id,
    userAmount = res.locals.currentUser.amount
    
    Order.find({}, (error, allOrders) => {
        console.log(allOrders.length + "   Orders length")
        if (allOrders.length >= 0){
            OrderNumber = 2018000000 + (allOrders.length + 1)
            console.log("nextIndex: " + allOrders.length + "+ 1 =" + OrderNumber)
            Order.create(new Order({
                _id: OrderNumber,
                userId: UserId,
                amount: productAmount,
                orderedProducts: orderedProducts,
                orderedProductsName: orderedProductsName,
                price: price,
                status: status,
                couponStatus: couponStatus,
                couponpriceModifier: couponpriceModifierValue
            }));   
        }

        AddOrdersToUser()
        
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://hotbunsjs.herokuapp.com/betaling/succes",
                "cancel_url": "https://hotbunsjs.herokuapp.com/betaling/mislukt"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "HotBuns Order",
                        "sku": OrderNumber,
                        "price": intPrice,
                        "currency": "EUR",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "EUR",
                    "total": intPrice
                },
                "description": "Al ruim 2500 jaar de beste bakker van Nederland!"
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
    })
});

router.post("/order/betaling", function (req, res) {
    UserId = res.locals.currentUser._id
    userFirstname = res.locals.currentUser.name
    userAdditionals = res.locals.currentUser.naamToevoeging
    userSurname = res.locals.currentUser.surname

    userEmail = req.body.email
    Username = req.body.username
    productAmount = req.body.amount.split(",")
    orderedProducts =  req.body.product_id[1].split(",")
    orderedProductsName = req.body.name
    price = req.body.price
    status = req.body.status
    OrderNumber = req.body.orderId || 0
    
    intPrice = parseInt(price).toFixed(2)

    couponStatus = req.body.couponStatus
    couponpriceModifierValue = req.body.couponpriceModifierValue
    var productIdArray = []

    allProductIds = orderedProducts,
    userAmount = productAmount
        console.log ("-------------")
    console.log(allProductIds)

    
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://hotbunsjs.herokuapp.com/betaling/succes",
            "cancel_url": "https://hotbunsjs.herokuapp.com/betaling/mislukt"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "HotBuns Order",
                    "sku": OrderNumber,
                    "price": intPrice,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": intPrice
            },
            "description": "Al ruim 2500 jaar de beste bakker van Nederland!"
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
})

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

    if(allProductIds.length > 1){
        for (i = allProductIds.length; i > 0; i--) {
            modifyAmountbought(i, allProductIds, userAmount)
        }
    }
    else{
        console.log("length != > 1 ")
        modifyAmountbought(allProductIds.length, allProductIds, userAmount)
    }

    
    Order.findByIdAndUpdate(OrderNumber, { $set: { status: "Betaald"}}, (error, updatedOrder) => {
        if (error){throw error}
    })
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } 
        else {
            console.log(JSON.stringify(payment));
            res.redirect('/betaling/afgerond')
        }
    })  
})

router.get('/betaling/afgerond', (req, res) => {
    Order.findById(OrderNumber).populate("userId").populate("orderedProducts").exec(function(error, foundOrder){
        if(error){throw error}
        
        var amountToArray = foundOrder.amount[0].split(",")
        res.render("orderdetail", {Order: foundOrder, amount: amountToArray})
    })
})

router.post('/betaling/afgerond', (req, res) => {
      // Voor de email opmaak. Zet alles onder elkaar.
      var notArray = []
      noLayout =  orderedProductsName
      withLayout = ""
      console.log(Array.isArray(orderedProductsName))
      
      if(Array.isArray(orderedProductsName) == false){
          notArray.push( orderedProductsName)
          notArray.forEach(function (element) {
              withLayout =  withLayout + "-   " + element + " <br />"
          })
      }
      if(Array.isArray( orderedProductsName) == true){
          noLayout.forEach(function (element) {
              withLayout =  withLayout + "-   " + element + " <br />"
          })
      } 
      console.log(noLayout)
  
      if (userAdditionals > 0) {
          fullaname = userFirstname + " " + userAdditionals + " " + userSurname;
      }
      else {
          fullaname = userFirstname + " " + userSurname;
      }
  // De email zelf.
      emailHtml = "<a> Beste " + fullaname + ", <br /> <br /> <a> <a> Bedankt dat u heeft gekozen voor HotBuns! <a> <br /> <br /> <a> Overzicht van de bestelling: <br /> " + withLayout + "<br /> <a> Wij hopen u snel terug te zien voor een volgende bestelling! <a> <br />  <br /> <a> Met vriendelijke groet, <br /><br /> HotBuns <a>"
      mailOptions = {
          from: 'hotbunsemail@gmail.com',
          to: userEmail,
          subject: 'HotBuns bestelling: ' + OrderNumber,
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

      res.redirect(req.get("referer"))
})

router.get('/betaling/mislukt', (req, res) => {
    req.flash("error", "Betaling afgebroken.");
    res.redirect('/gebruiker/'+ UserId + '/order/' + OrderNumber)
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};
////TEST//// ZORG ERVOOR DAT HET ALLE ITEMS PAKT DIE IN WINKELWAGEN ZITTEN

//exports every router so app.js can use these routes
module.exports = router;