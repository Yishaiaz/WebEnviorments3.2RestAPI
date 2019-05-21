

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
        azureControler.runQuery(`SELECT POIName, imgUrl FROM POI where POIName='${username}' AND password='${password}'`, function(err, rows) {
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




module.exports.addFavouritePOIToUser = function(username, newFavouritePoi) {
    let findHighestIndex = "SELECT MAX(place)\n" +
        "FROM UsersPOI\n" +
        "WHERE username='"+username+"' "+
        "GROUP BY username";
    var highestIndex = new Promise((resolve, reject)=> {
        azureControler.runQuery(findHighestIndex, function(err,rows){
            if(err){
                console.log("error"+err);
                // return new Promise((resolve,reject)=> reject(err))
                reject(err)
            }else if(rows){
                let num = rows[0][0].val;
                console.log("index: "+num);
                resolve(num);
            }else{
                resolve(0);
            }
        });
    });
    return highestIndex.then((data)=>{
        // console.log("index: "+data);
        let position = data+1;
        return new Promise((resolve, reject)=>{
            let query = "INSERT INTO UsersPOI VALUES('"+username+"','"+newFavouritePoi+"', GETDATE(),'"+position+"');";
            azureControler.runQuery(query, function(err, rows){
                if (err) {
                    console.log("error"+err);
                    reject(err);
                } else if (rows) {
                    resolve(rows);
                } else {
                    reject("Not Found");
                }
            });
        });
    }).catch((err)=>{
        console.log(err);
        return new Promise((resolve,reject)=>{
            reject("Something Went Wrong")
        });
    });
};
module.exports.setUserFavouritePOIOrder = function(username, newPoisOrder) {
    newPoisOrder.forEach(function(POIOrder){
        console.log(POIOrder["POIName"]+"new place: "+POIOrder["place"]);
        let query ="UPDATE UsersPOI" +
            "   SET place = "+POIOrder["place"] +
            " WHERE username ='"+username+"'  AND POIName='"+POIOrder["POIName"]+"'";
        azureControler.runQuery(query, function(err,rows){
            if(err){
                // console.log(err);
            }else if(rows){
                console.log(rows);
            }else{
                console.log("Not Found"+POIOrder["POIName"]+"... place: "+POIOrder["place"]);
            }
        })
    });
    return new Promise((resolve, reject) => {
        resolve("great!");
    });
};