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
        console.log("My SQL Connected,Products Model");
});

exports.getAllProducts = () => {
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM products', (err, results) => {
            if (results == undefined) {
                reject(new Error ("result not defined"));
            } else {
                resolve( results );
            }  
        })
    })      
}

exports.getProductsByCategory = (category) => {
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM products WHERE category=?', [category], (err, results) => {
            if (results == undefined) {
                reject(new Error ("result not defined"));
            } else {
                resolve( results );
            }  
        })
    })      
}

exports.getProductsById = (id) => {
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM products WHERE id=?', [id], (err, results) => {
            if (results == undefined) {
                reject(new Error ("result not defined"));
            } else {
                // console.log("DB item name="+results[0].name);
                resolve( results[0] );
            }  
        })
    })      
}

exports.addNewProduct = (data) => {
    return new Promise (function (resolve, reject) {
        db.query('INSERT INTO products SET ?',
            {name: data.name, price:data.price, category:data.category, description: data.description, img:data.image},
            (err, results) => {
            if (results == undefined) {
                reject("DB failed to add this product");
            } else {
                // console.log("DB item name="+results[0].name);
                resolve( );
            }  
        })
    }) 
}

exports.editProduct = (data) => {
    return new Promise (function (resolve, reject) {
        db.query('UPDATE products SET name=?, price=?, description=? WHERE id=?',
            [data.name, data.price, data.description, data.id],
            (err, results) => {
            if (err) {
                console.log(err);
                reject("DB failed to Edit this product");
            } else {
                // console.log("DB item name="+results[0].name);
                resolve();
            }  
        })
    }) 
}

exports.deleteProduct = (id)=> {
    return new Promise (function (resolve, reject) {
        db.query('DELETE FROM products WHERE id=?',
            [id],
            (err, results) => {
            if (err) {
                reject("DB failed to Delete this product");
            } else {
                // console.log("DB item name="+results[0].name);
                resolve();
            }  
        })
    }) 
}