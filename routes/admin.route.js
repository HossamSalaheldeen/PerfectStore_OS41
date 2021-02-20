const router = require("express").Router();
const check = require("express-validator").check;
const bodyParser = require("body-parser");

const multer = require("multer");

const adminController = require("../controllers/admin.controller");
const adminGuard = require("./guards/admin.guard");

router.get("/add", adminGuard, adminController.getAdd)

router.post("/add", adminGuard,
         multer({  //multer adds property (file or files) to the request
        //  dest: 'images', //destination-> the path to save data, path stats from app.js , but it will encrypt source name and extension
            storage: multer.diskStorage({
                destination: (req, file, callback) => {
                    callback(null, 'imgs/');  
                },
                filename: (rea, file, callback) => {
                    callback(null, Date.now() + "-" +  file.originalname); 
                    //Adding date to avoid name duplication
                }
            })
        }).single('image'),    // none-> if form has no files, singe(input_name)-> upload only one file, array-> many files from same input, fields, many files frm different fields
        check("name")
            .not().isEmpty().withMessage("name is required"),
        check("price")
            .not().isEmpty().withMessage("price is required")
            .isFloat({ min: 0.0000000009 }).withMessage("price must be greater than 0"),
        check("description")
            .not().isEmpty().withMessage("description is required"),
        check("category")
            .not().isEmpty().withMessage("category is required"),
        check("image").custom((value, {req}) => {
            if(req.file)  return true;              //if there is an image
            else throw "image is required";
        }),
        adminController.postAdd);

router.get("/orders", adminGuard, adminController.getOrders);

router.get("/edit/:id", adminGuard,adminController.getProductToedit);
router.post("/edit", adminGuard, bodyParser.urlencoded({extended: true}),
    check("name")
        .not().isEmpty().withMessage("name is required"),
    check("price")
        .not().isEmpty().withMessage("price is required")
        .isFloat({ min: 0.0000000009 }).withMessage("price must be greater than 0"),
    check("description")
        .not().isEmpty().withMessage("description is required"),
    adminController.editProductById);

router.post("/delete", adminGuard, bodyParser.urlencoded({extended: true}), adminController.deleteProductById);

router.post(
    "/orders",
    adminGuard,
    bodyParser.urlencoded({ extended: true }),
    adminController.postOrders
);

module.exports = router;