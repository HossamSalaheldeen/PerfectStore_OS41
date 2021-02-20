const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");

const validationResult = require("express-validator").validationResult;

exports.getOrderVerify = (req, res, next) => {
    cartModel
        .getItemById(req.query.order)
        .then(cartItem => {
            res.render("verify-order", {
                cart: cartItem,
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: "Verify-Order",
                validationError: req.flash("validationErrors")[0]
            });
        })
        .catch(err => res.redirect("/error"));
};

exports.getOrder = (req, res, next) => {
    orderModel
        .getOrdersByUser(req.session.userId)
        .then(items => {
            res.render("orders", {
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: "Orders",
                items: items
            });
        })
        .catch(err => res.redirect("/errors"));
};

exports.postOrder = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        orderModel
            .addNewOrder({
                userId : req.session.userId,
                productId : req.body.productId,
                productName : req.body.name,
                productPrice: req.body.price,
                productAmount : req.body.amount,
                address: req.body.address,
                timeStamp : Date.now()
            })
            .then(() => res.redirect("/orders"))
            .catch(err => {
                res.redirect("/errors");
            });
    }
    else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/verify-order?order=" + req.body.cartId);
    }
};

exports.postCancel = (req, res, next) => {
    orderModel
        .cancelOrder(req.body.orderId)
        .then(() => res.redirect("/orders"))
        .catch(err => {
            res.redirect("/error");
        });
};
