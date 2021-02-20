const cartModel = require("../models/cart.model");
const validationResult = require("express-validator").validationResult;

exports.postCart = (req, res, next)=> {
    if(validationResult(req).isEmpty()) {
        cartModel.addNewItem({
            userId : req.session.userId,
            productId : req.body.productId,
            productName : req.body.productName,
            productPrice: req.body.productPrice,
            productAmount : req.body.amount,
            timeStamp : Date.now()
        }).then(()=> {
            res.redirect("/cart")
        }).catch(err => {
            res.redirect("/errors");
        })
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect(req.body.redirectTo);
    }
}

exports.getCard = (req, res, next)=> {
    cartModel.getItemByUserId(req.session.userId)
    .then((items) => {
        res.render("cart.ejs", {
            items: items,
            validationError: req.flash('validationError')[0],
            isUser: true,
            isAdmin: req.session.isAdmin,
            pageTitle: "Cart"
        })
    }).catch(err => res.redirect("/errors"))
}

exports.postSave = (req, res, next) => {
    if(validationResult(req).isEmpty()) {
        // console.log(req.session.userId +", "+req.body.productId+", "+req.body.amount);
        cartModel.editItem(req.session.userId, req.body.productId, {
            productAmount : req.body.amount,
            timeStamp : Date.now()  
        })
        .then(()=> {
            res.redirect("/cart")
        }).catch(err => {
            res.redirect("/errors");
        })
    } else {
        req.flash('validationError', validationResult(req).array());
        res.redirect("/cart");
    }
}

exports.postDelete = (req, res, next)=> {
    cartModel.deleteItem(req.session.userId, req.body.productId)
    .then(()=> {
        res.redirect("/cart")
    }).catch(err => {
        res.redirect("/errors");
    })
}