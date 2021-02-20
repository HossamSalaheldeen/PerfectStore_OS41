const router = require("express").Router();
const check = require("express-validator").check;
const bodyParser = require("body-parser");

const authGaurd = require("./guards/auth.guard")
const userController = require("../controllers/user.controller");

router.get("/", authGaurd.isAuth, userController.getProfile);
router.post("/edit", authGaurd.isAuth, bodyParser.urlencoded({ extended: true }),
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
    userController.editUser);

module.exports = router;