const router = require("express").Router();
const bodyParser = require("body-parser");
// express-validator return object has many functions to validate sign-in process
// check -> to make validaty check | result -> contain result if the check fails
const check = require("express-validator").check;

const authController = require("../controllers/auth.controller");

router.get("/register", authController.getRegister);
router.post("/register", 
    bodyParser.urlencoded({extended: true}), // True will allow us to use (qs) instead of (queryString)
    check('username')
        .not().isEmpty().withMessage('username is required'), // withMessage contain the message returned if failed
    check('email')
        .not().isEmpty().withMessage('email is required')  //not() is applied onl to the next validator
        .isEmail().withMessage("not a valid email"), 
    check('password')
        .not().isEmpty().withMessage('password is required')
        .isLength({min:6}).withMessage('password must be at least 6 characters'),
    check('confirmPassword')
        .custom((confirmPassword, {req}) => { //custom pass meta data containing request
            if(confirmPassword == req.body.password)
                return true;
            else
                throw "Password Confirmation Failed"
        }),
    authController.postRegister);

router.get("/login", authController.getLogin);
router.post("/login", 
    bodyParser.urlencoded({extended: true}), // True will allow us to use (qs) instead of (queryString)
    check('email')
        .not().isEmpty().withMessage('email is required')
        .isEmail().withMessage("not a valid email"), 
    check('password')
        .not().isEmpty().withMessage('password is required')
        .isLength({min:6}).withMessage('password must be at least 6 characters'),
    authController.postLogin);

router.all("/logout", authController.logout); // Using all not POST, to handle if the user writes logout in url (which means GET)

module.exports = router;