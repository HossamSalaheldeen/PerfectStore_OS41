const getAuthModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

exports.getRegister = (req, res, next) => {
    res.render("register", {
        authError : req.flash('authError')[0],
        validationErrors : req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        pageTitle: "Register"
    });
}

exports.postRegister = (req, res, next) => {
    // validationResult(req).array().length == 0
    if(validationResult(req).isEmpty()){
        getAuthModel.createNewUser(req.body.username, req.body.email, req.body.password)
        .then(()=> {
            res.redirect('/login')
        }).catch( err => { 
            req.flash('authError', err)
            res.redirect('/register')
        });
    } else {
        req.flash('validationErrors', validationResult(req).array()); //as it is an array we don't need to use [0] it will be saved as an only one array (not nested)
        res.redirect('/register');
    }
    
}

exports.getLogin = (req, res, next) => {
    // If there is a problem in login/post will redirect to login/get and send flash(authError) in the request
    res.render("login", {
        authError : req.flash('authError')[0],
        validationErrors : req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        pageTitle: "Login"
    });
}

exports.postLogin = (req, res, next) => {
    if(validationResult(req).isEmpty()) {
        getAuthModel.login(req.body.email, req.body.password)
        .then((result)=> {
            req.session.userId = result.id;
            req.session.isAdmin = result.isAdmin;    
            res.redirect("/");
        })
        .catch(err => {
            // console.log(err);
            req.flash('authError', err) //flash is saved by (key:value), here authErorr is the key
            res.redirect("/login");
        })
    } else {
        req.flash('validationErrors', validationResult(req).array()); 
        res.redirect('/login');
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy(() => { //This will remove session details from database
        res.redirect("/");
    })
}