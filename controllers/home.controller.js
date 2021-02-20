const productsModel = require("../models/products.model");

exports.getHome = (req, res, next) => {
    //1- Get Products From DB
    //2-  Render index.ejs 

    //Get Category (if category && category != all)
    let category = req.query.category;
    // console.log(category);
    let validCategories = ['T-shirt', 'Suit-shirt']; //in case user enter category in url and not in our products will show all products
    
    if (category && validCategories.includes(category)){
        productsModel.getProductsByCategory(category).then((products) => {
            // console.log("Control "+ products[0].name);
            res.render('index', {
                products : products,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                pageTitle: "Products",
                validationError : req.flash("validationErrors")[0]
            })
        })    
    } else {
        productsModel.getAllProducts().then((products) => {
            // console.log("Control "+ products[0].name);
            res.render('index', {
                products : products,
                isUser : req.session.userId,
                isAdmin: req.session.isAdmin, 
                pageTitle: "Products",
                validationError : req.flash("validationErrors")[0]
            })
        })
    }
    
}