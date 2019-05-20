
const azureControler = require("../dbControllers/azureDb");
const jwt= require('jsonwebtoken');
module.exports.userLogin =  function(username, password){
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT username FROM Users where username="+username+" AND password="+password, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                let userName=rows[0][0]['val'];
                const token=jwt.sign({username: userName},'myPrivateKey');
                resolve(token);
            } else {
                resolve("login failed");
                console.log("wrong username or password");

            }
        });
    });
};

module.exports.addUser= function (username, password,firstname,lastname,city,country,email,question1,answer1,question2,answer2) {
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`INSERT INTO Users VALUES ('${username}','${password}','${firstname}','${lastname}'
        ,'${city}','${country}','${email}','${question1}','${answer1}','${question2}','${answer2}')`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                const token=jwt.sign({username: username},'myPrivateKey');
                resolve(token);
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
                resolve(null);
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
                resolve(null);
                console.log("wrong username or Q&A");
            }
        });
    });
};