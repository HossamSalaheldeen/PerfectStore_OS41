const productsModel = require("../models/products.model")

exports.getProductById = (req, res, next) => {
    // Get id, Get product, Render
    let id = req.params.id;
    // console.log("Searched id ="+id);
    productsModel.getProductsById(id).then((product)=> {
        // console.log("Product Name="+ product.name);
        res.render('product', {
            product: product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            pageTitle: "Product"
        })
    })
}