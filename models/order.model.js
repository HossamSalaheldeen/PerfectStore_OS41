const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path: "./.env" })

const cartModel = require("./cart.model");

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
        console.log("My SQL Connected, Orders Model");
});

exports.addNewOrder = data => {
    return new Promise((resolve, reject) => {
        cartModel
            .deleteItem(data.userId, data.productId)
            .then(
                db.query('INSERT INTO orders SET ?',
                {userId: data.userId, productId: data.productId, productName: data.productName, price: data.productPrice, amount: data.productAmount, address:data.address,timeStamp: data.timeStamp}, 
                (err, results) => {
                    if (err) {
                        console.log(err);
                        reject("DataBase Failed to add to Orders");
                    } else {
                        resolve();
                    }  
                })
            )
            .catch(err => {
                reject(err);
            });
    });
};

exports.getOrdersByUser = userId => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orders WHERE userId=? ORDER BY timeStamp', [userId], (err, results) => {
            if (err) {
                reject("DB Failed to retrieve user orders");
            } else {
                // console.log("DB item name="+results[0].name);
                resolve( results );
            }  
        })
    });
};

exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM orders WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.log(err);
                reject("DataBase Failed to Delete from Orders");
            } else {
                resolve();
            }  
        })
    });
};

exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orders ORDER BY timeStamp', (err, results) => {
            if (err) {
                console.log(err);
                reject("DB Failed to retrieve All Orders");
            } else {
                resolve( results );
            }  
        })
    });
};

exports.editOrder = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE orders SET status=? WHERE id=?', [newStatus, id], (err, results) => {
            if (err) {
                console.log(err);
                reject("DB Failed to retrieve All Orders");
            } else {
                resolve( results );
            }  
        })
    });
};
