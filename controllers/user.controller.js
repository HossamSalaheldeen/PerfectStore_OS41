const getAuthModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;


exports.getProfile = (req, res, next) => {
    getAuthModel.getUserInfoById(req.session.userId).then(user => {
        console.log(user.username);
        res.render("userInfo", {
            user: user,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            pageTitle: "User-count",
            validationErrors: req.flash("validationErrors"),
            userEdited: req.flash("userEdited")[0]
        })
    })
}

exports.editUser = (req, res, next) => {
    // console.log(req.body);
    if(validationResult(req).isEmpty()) {
        getAuthModel.editUser(req.body)
        .then(()=> {
            req.flash("userEdited", true);
            res.redirect("/user");
        })
        .catch(err => {
            // console.log(err);
            res.redirect("/error");
        })
    } else {
        req.flash('validationErrors', validationResult(req).array()); 
        res.redirect('/user');
    }
}