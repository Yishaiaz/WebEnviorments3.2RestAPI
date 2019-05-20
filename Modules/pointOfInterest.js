const express = require("express");
const azureControler = require("../dbControllers/azureDb");
const app = express();

// ENABLES US TO PARSE JSON'S DIRECTLY FROM REQ/RES
function jsoniFy(sqlRows){
    return {};
}
module.exports.getAll =  function(){
  let resultsArray=[];
  return new Promise((resolve, reject)=>{
      azureControler.runQuery("SELECT * FROM POI", function(err, rows) {
          if (err) {
              console.log("error"+err);
              reject('error'+err);
          } else if (rows) {
              for (let i = 0; i < rows.length; i++) {
                  let results={};
                  rows[0].forEach(function(row){
                      results[row['col']]=row.val;
                  });
                  resultsArray.push(results);
              }
              resolve(resultsArray);
          } else {
              reject("Not Found");
          }
      });
  });
};
module.exports.getPOIDetails =  function(POIName){
    let results={};
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT * FROM POI where POIName="+POIName, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                rows[0].forEach(function(row){
                    results[row['col']]=row.val;
                });
                resolve(results);
            } else {
                reject("Not Found");
            }
        });
    });
};
//todo: return 3 random poi now returns only 1.
module.exports.getRandomPOI =  function(minimalRank){
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT * FROM POI WHERE rank>="+minimalRank, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                let randomIndex=Math.floor(Math.random() * rows.length);
                resolve(rows[randomIndex]);
            } else {
                reject("Not Found");
            }
        });
    });
};

module.exports.searchPOI =  function(poiName){
    let results={};
    return new Promise((resolve, reject)=>{
        let query="SELECT * FROM POI WHERE POIName LIKE '%"+poiName+"%'";
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                rows[0].forEach(function(row){
                    results[row['col']]=row.val;
                });
                resolve(results);
            } else {
                reject("Not Found");
            }
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

module.exports.getAllPOIReviews =  function(POIName){
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        let query=`SELECT * FROM Reviews where POIName = '${POIName}'`;
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                for (let i = 0; i < rows.length; i++) {
                    let results={};
                    rows[0].forEach(function(row){
                        results[row['col']]=row.val;
                    });
                    resultsArray.push(results);
                }
                resolve(resultsArray);
            } else {
                reject("Not Found");
            }
        });
    });
};
module.exports.getPOIByCategory =  function (categoryName) {
    let resultsArray = [];
    console.log("in poi/getpoibycategory");
    return new Promise((resolve, reject) =>{
        let query=`SELECT POIName FROM POICategories where categoryName = '${categoryName}'`;
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                console.log("adding rows");
                for (let i = 0; i < rows.length; i++) {
                    let results={};
                    rows[0].forEach(function(row){
                        results[row['col']]=row.val;
                    });
                    resultsArray.push(results);
                }
                console.log("resolving");
                resolve(resultsArray);
            } else {
                reject("Not Found");
            }
        });
    });
};

module.exports.getRandomImgUrls= function(numOfImagesRequested){
    let resultsArray = [];
    return new Promise((resolve, reject) =>{
        let query=`SELECT imgUrl FROM POI`;
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                console.log("adding rows");
                for (let i = 0; i < rows.length; i++) {
                    let results={};
                    rows[0].forEach(function(row){
                        results[row['col']]=row.val;
                    });
                    resultsArray.push(results);
                }
                console.log("resolving");
                resolve(resultsArray);
            } else {
                reject("Not Found");
            }
        });
    });
};