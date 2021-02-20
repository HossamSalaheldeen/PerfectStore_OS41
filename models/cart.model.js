const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path: "./.env" })

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err)=> {
    if (err) 
        console.log(err);
    else
        console.log("My SQL Connected, Cart Model");
});

exports.addNewItem = (data) => {
    return new Promise (function (resolve, reject) {
        db.query('INSERT INTO cart SET ?',
        {userId: data.userId, productId: data.productId, productName: data.productName, price: data.productPrice, amount: data.productAmount, timeStamp: data.timeStamp}, 
        (err, results) => {
            if (err) {
                console.log(err);
                reject("DataBase Failes to add to Cart");
            } else {
                resolve();
            }  
        })
    })      
}

exports.getItemByUserId = (userId) => {
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM cart WHERE userId=? ORDER BY timeStamp', [userId], (err, results) => {
            if (err) {
                reject("DB Failed to retrieve user cart");
            } else {
                // console.log("DB item name="+results[0].name);
                resolve( results );
            }  
        })
    })  
}

exports.editItem = (userId, productId, newData) => {
    return new Promise (function (resolve, reject) {
        // console.log(newData.productAmount+", "+ newData.timeStamp+", "+ userId+", "+ productId)
        db.query('UPDATE cart SET amount = ? , timeStamp = ? WHERE userId = ? AND productId = ?',
        [newData.productAmount, newData.timeStamp, userId, productId],  
        (err, results) => {
            if (err) {
                console.log(err);
                reject("DataBase Failed to Edit Cart");
            } else {
                resolve();
            }  
        })
    })
}

exports.deleteItem = (userId, productId) => {
    return new Promise (function (resolve, reject) {
        db.query('DELETE FROM cart WHERE userId = ? AND productId = ?',
        [userId, productId],  
        (err, results) => {
            if (err) {
                console.log(err);
                reject("DataBase Failed to Delete from Cart");
            } else {
                resolve();
            }  
        })
    })
}

exports.getItemById = (itemId) => {
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM cart WHERE id=? ', [itemId], (err, results) => {
            if (err) {
                reject("DB Failed to retrieve item from cart");
            } else {
                resolve( results[0] );
            }  
        })
    })  
}