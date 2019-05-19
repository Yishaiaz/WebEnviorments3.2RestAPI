const azureControler = require("../dbControllers/azureDb");

module.exports.userLogin =  function(username, password){
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT * FROM Users where username="+username+" AND password="+password, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve("login succeed");
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
                resolve("user added succeed");
            } else {
                resolve("add user failed");
                console.log("add fail");
            }
        });
    });
};

export function restorePassword(username, question, answer) {
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`SELECT password FROM Users where username= '${username}' 
        AND ((Question1='${question}' AND Answer1='${answer}') OR (Question2='${question}' AND Answer2='${answer}'))`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve("login succeed");
            } else {
                resolve("login failed");
                console.log("wrong username or password");

            }
        });
    });
}