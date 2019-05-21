
const azureControler = require("../dbControllers/azureDb");
const jwt= require('jsonwebtoken');
module.exports.userLogin =  function(username, password){
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`SELECT username FROM Users where username='${username}' AND password='${password}'`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(username);
            } else {
                reject('error'+err);
                console.log("wrong username or password");

            }
        });
    });
};

module.exports.addUser= async function (username, password,firstname,lastname,city,country,email,question1,answer1,question2,answer2) {
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`INSERT INTO Users VALUES ('${username}','${password}','${firstname}','${lastname}'
        ,'${city}','${country}','${email}','${question1}','${answer1}','${question2}','${answer2}')`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(username);
            } else {
                resolve("add user failed");
                console.log("add fail");
            }
        });
    });
};

module.exports.restorePassword=function (username, question, answer) {
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`SELECT password FROM Users where username= '${username}' 
        AND ((Question1='${question}' AND Answer1='${answer}') OR (Question2='${question}' AND Answer2='${answer}'))`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(rows[0][0].val);
            } else {
                resolve("Not Found");
                console.log("wrong username or Q&A");
            }
        });
    });
};

module.exports.addFavouritePOIToUser = function(username, newFavouritePoi) {
    return new Promise((resolve, reject)=>{
        let query=`INSERT INTO UsersPOI VALUES ('${username}','${newFavouritePoi}',GETDATE())`;
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(rows[0][0].val);
            } else {
                resolve("Not Found");
                console.log("wrong username or Q&A");
            }
        });
    });
};


module.exports.addUserCategories = function(username, categories) {
    return new Promise((resolve, reject)=>{
        // let query=`INSERT INTO UsersCategories VALUES ('${username}','${newFavouritePoi}',GETDATE())`;
        let query="INSERT INTO UsersCategories VALUES ";
        for (let i = 0; i < categories.length-1; i++) {
            let value=`('${username}','${categories[i]}'),`;
            query+=value;
        }
        let value=`('${username}','${categories[categories.length-1]}');`;
        query+=value;
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(username);
            } else {
                resolve("Not Found");
                console.log("wrong username or Q&A");
            }
        });
    });
};

module.exports.get2popularpoi =  function(username){
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`SELECT username FROM Users where username='${username}' AND password='${password}'`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(username);
            } else {
                reject('error'+err);
                console.log("wrong username or password");

            }
        });
    });
};
