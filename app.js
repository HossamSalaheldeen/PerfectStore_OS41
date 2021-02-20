const express = require('express');
const path = require('path');

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path: "./.env" });
var session = require('express-session');
var SessionStore = require('express-mysql-session')(session);

const flash = require("connect-flash"); //Module to save errors once, the disappear after displaying

const app = express();

const homeRouter = require("./routes/home.route");
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/orders.route");
const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'imgs')));
app.use(flash()); //Add function flash() to request object

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});
var STORE = new SessionStore({}, db);  
app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: STORE,
	resave: false,
	saveUninitialized: false
    // cookie: Maxtime to define the session time, the default value is it ends when closing the browser
}));

app.set("view engine", "ejs");
app.set("views", "views"); //Default Value

// app.get("/", (req,res,next)=>{
//     res.render("index");
// })
app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/", orderRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.get("/errors", (req, res, next) => {
    res.status(500);
    res.render("errors.ejs", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Error"
    });
});

app.get("/not-admin", (req, res, next) => {
    res.status(403);
    res.render("not-admin", {
        isUser: req.session.userId,
        isAdmin: false,
        pageTitle: "Not Allowed"
    });
});

app.get("/home-index", (req, res, next) => {
    res.status(403);
    res.render("homeindex", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Home"
    });
});

app.get("/", (req, res, next) => {
    res.status(403);
    res.render("homeindex", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Home"
    });
});

app.listen(3000, ()=> {
    console.log('server listen on port 3000')
})