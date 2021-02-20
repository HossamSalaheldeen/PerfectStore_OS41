const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({path: "./.env" });
const bcrypt = require("bcrypt");

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
        console.log("My SQL Connected");
});

exports.createNewUser = (username, email, password) => {
    // Check if email exists (if yes, then can not be used again)
    return new Promise (function (resolve, reject) {
        db.query('SELECT email FROM users WHERE email=?', [email], async (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            if (results.length > 0) {
                reject("Email is used");
            } else {

                let hasedPassword = await bcrypt.hash(password, 10);  //eight rounds of encryption
                console.log(hasedPassword);

                db.query("INSERT INTO users SET ?", {username: username, email: email, password: hasedPassword}, (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Inserted into DB "+results);
                        // db.end(function(err) {
                        //     if (err) {
                        //       return console.log('error:' + err.message);
                        //     }
                        //     console.log('Close the database connection.');
                        //   });
                        resolve( "User Added" );
                    }
                })

                
            }  
        })
    })   
}

exports.login = (email, password) => {
    // Check if the email exists in DB , if no then error
    // if exists, Check for Password , if not match then error
    // if matches , set cookie (isUser, boolean) OR set session better
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM users WHERE email=?', [email], async (err, results) => {
            if(results[0] === undefined || !(await bcrypt.compare(password, results[0].password))) {
                // console.log(results);
                reject("Not a vaild user, incorrect email, password or both");
            } else {
                // db.end(function(err) {
                //     if (err) {
                //       return console.log('error:' + err.message);
                //     }
                //     console.log('Close the database connection.');
                //   });
                resolve({
                    id: results[0].id,
                    isAdmin: results[0].isAdmin
                })
            }
        })
    })
}


exports.getUserInfoById = (id) => {
    return new Promise (function (resolve, reject) {
        db.query('SELECT * FROM users WHERE id=?', [id], async (err, results) => {
            // console.log(results[0]);
            if(err) {
                // console.log(err);
                reject("DB failed to retrive user info");
            } else {
                // db.end(function(err) {
                //     if (err) {
                //       return console.log('error:' + err.message);
                //     }
                //     console.log('Close the database connection.');
                //   });
                resolve(results[0])
            }
            
        })
    })
}

exports.editUser = async (data) => {
    let hasedPassword = await bcrypt.hash(data.password, 10);  //eight rounds of encryption
    console.log(hasedPassword);
    return new Promise (function (resolve, reject) {
        db.query('UPDATE users SET username=?, email=?, password=? WHERE id=?',
            [data.username, data.email, hasedPassword, data.id],
             async (err, results) => {
            // console.log(results[0]);
            if(err) {
                console.log(err);
                reject("DB failed to edit user info");
            } else {
                // db.end(function(err) {
                //     if (err) {
                //       return console.log('error:' + err.message);
                //     }
                //     console.log('Close the database connection.');
                //   });
                resolve(results[0])
            }
            
        })
    })
}