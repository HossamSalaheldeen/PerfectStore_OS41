const productsModel = require("../models/products.model");
const ordersModel = require("../models/order.model");
const validationResult = require("express-validator").validationResult;

exports.getAdd = (req, res, next) => {
    res.render("add-product", {
        validationErrors : req.flash("validationErrors"),
        isUser: true,
        isAdmin: true,
        pageTitle: "Add-Product",
        productAdded: req.flash("added")[0]
    })
}

exports.postAdd = (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    if (validationResult(req).isEmpty()) {
        console.log("Controller"+ req.file.filename);
        req.body.image = req.file.filename;
        productsModel
            .addNewProduct(req.body)
            .then(() => {
                req.flash("added", true);
                res.redirect("/admin/add");
            })
            .catch(err => {
                res.redirect("/errors");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/admin/add");
    }   
}

exports.getProductToedit = (req, res, next) => {
    let id = req.params.id;
    productsModel.getProductsById(id).then(product => {
        res.render ('product-edit', {
            product: product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            pageTitle: "Edit-Product",
            validationErrors: req.flash("validationErrors"),
            productEdited: req.flash("edited")[0]
        })
    })
}

exports.editProductById = (req,res,next) => {
    // console.log(req.body);
    if (validationResult(req).isEmpty()) {
        productsModel.editProduct(req.body).then((product)=> {
            req.flash("edited", true);
            res.redirect ('/admin/edit/'+req.body.id);
        }).catch(err=> {            
            res.redirect("/errors");
        })
    }else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect ('/admin/edit/'+req.body.id)
    }
}

exports.deleteProductById = (req, res, next) => {
    console.log((req.body.id));
    productsModel.deleteProduct(req.body.id).then(()=> {
        res.redirect("/products");
    }).catch(err=> {
        console.log(err);
        res.redirect("/errors");
    })
}

exports.getOrders = (req, res, next) => {
    ordersModel
        .getAllOrders()
        .then(items => {
            res.render("manage-orders", {
                // pageTitle: "Manage Orders",
                isUser: true,
                isAdmin: true,
                pageTitle: "Manage-orders",
                items: items
            });
        })
        .catch(err => res.redirect("/error"));
};

exports.postOrders = (req, res, next) => {
    ordersModel
        .editOrder(req.body.orderId, req.body.status)
        .then(() => res.redirect("/admin/orders"))
        .catch(err => {
            res.redirect("/error");
        });
};