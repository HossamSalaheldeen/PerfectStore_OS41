const router = require('express').Router();
const authGuard = require('./guards/auth.guard');

const homeController = require("../controllers/home.controller");

router.get("/products",
     //authGuard.isAuth, //Check if logged in user first
     homeController.getHome); 

module.exports = router;