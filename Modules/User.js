

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
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        let query=`SELECT p.POIName, p.imgUrl
        FROM POI p JOIN POICategories pc ON p.POIName=pc.POIName
        JOIN (SELECT MAX(p.rank) AS maxRank , u.categoryName FROM POI p
        JOIN POICategories pc ON p.POIName = pc.POIName
        JOIN UsersCategories u ON u.categoryName = pc.categoryName
        WHERE u.username='${username}'
        GROUP BY u.categoryName) AS j
        ON p.rank=j.maxRank AND pc.categoryName=j.categoryName`;
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                let ansSize=2;
                if(rows.length<ansSize)
                    ansSize=rows.length;
                for (let i = 0; i < ansSize; i++) {
                    let results={};
                    let randomIndex=Math.floor(Math.random() * rows.length);
                    rows[randomIndex].forEach(function(row){
                        results[row['col']]=row.val;
                    });
                    resultsArray.push(results);
                    rows.splice(randomIndex,1);
                }
                resolve(resultsArray);
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

module.exports.getUserAuthQuestion = function (username) {
    return new Promise((resolve, reject)=>{
        azureControler.runQuery(`SELECT Question1, Question2 FROM Users where username='${username}'`, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                var results={};
                results["Question1"] = rows[0][0].val;
                results["Question2"] = rows[0][1].val;
                resolve(results);
            } else {
                reject('error'+err);
                console.log("wrong username or password");

            }
        });
    });
};

module.exports.getUserFavouritePOI = function(username) {
    return new Promise((resolve, reject) => {
        let query = `SELECT p.POIName, p.imgUrl , up.place FROM POI p JOIN UsersPOI up ON up.POIName = p.POIName WHERE up.username = '${username}'`;
        azureControler.runQuery(query, function(err, rows){
            if(err){
                console.log(err);
                reject(err);
            }else if(rows){
                let results=[];
                rows.forEach((row)=>{
                    console.log(row);
                    let singleRow={};
                    singleRow["POIName"] = row[0].val;
                    singleRow["imgUrl"] = row[1].val;
                    singleRow["place"] = row[2].val;
                    results.push(singleRow);
                });
                resolve(results);
            }else{
                resolve("Not Found");
            }
        });
    })
};
module.exports.deleteUserPOI = function (username, poiName) {
    return new Promise((resolve, reject) => {
       let query = `DELETE FROM UsersPOI where username='${username}' AND POIName='${poiName}'`;
       azureControler.runQuery(query, function(err, rows){
           if(err){
               reject(err);
           }else if(rows){
               resolve("success");
           }else{
               reject("Not Found");
           }
       });
    });
};

module.exports.getUserLast2SavedPOI=  function (username) {
    var allUserPOIandImgUrl = new Promise((resolve, reject) => {
        let query = `SELECT p.POIName, p.imgUrl, up.date FROM POI p JOIN UsersPOI up ON up.POIName = p.POIName WHERE up.username = '${username}'`;
        azureControler.runQuery(query, function(err, rows){
            if(err){
                console.log(err);
                reject(err);
            }else if(rows){
                let results=[];
                rows.forEach((row)=>{
                    let singleRow={};
                    singleRow["POIName"] = row[0].val;
                    singleRow["imgUrl"] = row[1].val;
                    singleRow["date"] = row[2].val;
                    results.push(singleRow);
                });
                resolve(results);
            }else{
                resolve("Not Found");
            }
        });
    });
    return allUserPOIandImgUrl
        .then((data)=>{

            let highestDate= new Date(-8640000000000000);
            let secondHighestDate = new Date(-8640000000000000);
            var results=[];
            data.forEach((row)=>{
                console.log(row);
                if(row['date']> secondHighestDate && row['date'] > highestDate){
                    secondHighestDate = highestDate;
                    highestDate = row['date'];
                }
                if(row['date']> secondHighestDate && row['date'] < highestDate){
                    secondHighestDate = row['date'];
                }
                if(row['date']> highestDate){
                    highestDate = row['date'];
                }
            });
            data.forEach((row)=>{
               if(row['date']===highestDate){
                   results.push({
                       "POIName": row['POIName'],
                       "imgUrl": row['imgUrl']
                   });
               } else if(row['date']===secondHighestDate){
                   results.push({
                       "POIName": row['POIName'],
                       "imgUrl": row['imgUrl']
                   });
               }
            });
            return new Promise((resolve, reject) => {
                resolve(results);
            });
        })
        .catch((err)=>{
            return new Promise((resolve, reject) => {
                reject(err);
            });
        });
};
module.exports.updateUserCategories =  function (username, newCategories) {
    var deletePromise = new Promise((resolve, reject) => {
        console.log("username: "+username);
        let query = `DELETE FROM UsersCategories where username='${username}'`;
        azureControler.runQuery(query, function(err, rows){
            if(err){
                reject(err);
            }else if(rows){
                resolve("success");
            }else{
                resolve("Not Found");
            }
        });
    });
    return deletePromise
        .then((data)=>{
            let query = `INSERT INTO UsersCategories VALUES`;
            newCategories.forEach((categoryName)=>{
                console.log(categoryName['categoryName']);
                console.log(username);
                query+=`('${username}','${categoryName['categoryName']}'),`
            });
            query = query.substring(0, query.length-1);
            console.log(query);
            return new Promise((resolve, reject) => {
                azureControler.runQuery(query, function(err, rows){
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else if (rows) {
                        resolve(rows);
                    } else {
                        reject("Not Found");
                    }
                });
            });
        })
        .catch((err)=>{
            console.log(err);
            return new Promise((resolve,reject)=>{
                reject("Something Went Wrong")
            });
        });
};

module.exports.addReview =  function(poiName,content,rating,username){
    return new Promise((resolve, reject)=>{
        let query=`INSERT INTO Reviews VALUES ('${username}',`+rating+`,'${content}','${poiName}',GETDATE())`;
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve('Review added succeed');
            } else {
                reject("Not Found");
            }
        });
    });
};

module.exports.deleteUser = function (username) {
    return new Promise((resolve, reject) => {
        let query = `DELETE FROM Users where username='${username}'`;
        azureControler.runQuery(query, function(err, rows){
            if(err){
                reject(err);
            }else if(rows){
                resolve("success");
            }else{
                reject("Not Found");
            }
        });
    });
};