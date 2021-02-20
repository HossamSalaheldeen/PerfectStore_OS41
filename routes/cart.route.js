const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const authGaurd = require("./guards/auth.guard")
const cartController = require("../controllers/cart.controller");

router.get("/", authGaurd.isAuth, cartController.getCard)

router.post("/", authGaurd.isAuth, bodyParser.urlencoded({extended: true}), 
    check("amount")
        .not().isEmpty().withMessage("please, choose needed amount")
        .isInt({min:1}).withMessage("Amount must be at least 1"),
    cartController.postCart
    )

router.post("/save", authGaurd.isAuth, bodyParser.urlencoded({extended: true}),
    check("amount")
    .not().isEmpty().withMessage("please, choose needed amount")
    .isInt({min:1}).withMessage("Amount must be at least 1"),
    cartController.postSave
)

router.post("/delete", authGaurd.isAuth, bodyParser.urlencoded({extended: true}), cartController.postDelete)

module.exports = router;