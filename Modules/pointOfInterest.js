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
      azureControler.runQuery("SELECT POIName, imgUrl FROM POI", function(err, rows) {
          if (err) {
              console.log("error"+err);
              reject('error'+err);
          } else if (rows) {
              for (let i = 0; i < rows.length; i++) {
                  let results={};
                  rows[i].forEach(function(row){
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
        azureControler.runQuery(`SELECT * FROM POI where POIName='${POIName}'`, function(err, rows) {
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
module.exports.getRandomPOI =  function(minimalRank){
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT POIName, imgUrl FROM POI WHERE rank>="+minimalRank, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                for (let i = 0; i < 3; i++) {
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
                reject("Not Found");
            }
        });
    });
};

module.exports.searchPOI =  function(poiName){
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        let query="SELECT POIName, imgUrl FROM POI WHERE POIName LIKE '%"+poiName+"%'";
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                for (let i = 0; i < rows.length; i++) {
                    let results={};
                    rows[i].forEach(function(row){
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
                    rows[i].forEach(function(row){
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
        let query=`SELECT POIName, imgUrl FROM POICategories where categoryName = '${categoryName}'`;
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                console.log("adding rows");
                for (let i = 0; i < rows.length; i++) {
                    let results={};
                    rows[i].forEach(function(row){
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
    let resultsArray = {};
    return new Promise((resolve, reject) =>{
        let query=`SELECT imgUrl FROM POI`;
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                for (let i = 0; i < numOfImagesRequested; i++) {
                    let randValue=Math.floor(Math.random() * rows.length);
                    var value = rows[randValue][0].val;
                    resultsArray[i]= value;
                }
                resolve(resultsArray);
            } else {
                reject("Not Found");
            }
        });
    });
};

module.exports.incrementViews =  function(poiName){
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        let query=`UPDATE POI SET views = views + 1 WHERE POIName = '${poiName}'`;
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                resolve(poiName);
            } else {
                reject("Not Found");
            }
        });
    });
};

module.exports.getNPOIReviews =  function(POIName,numOfREviews){
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        let query=`SELECT TOP ${numOfREviews} * FROM Reviews where POIName = '${POIName}' ORDER BY date DESC`;
        console.log(query);
        azureControler.runQuery(query, function(err, rows) {
            if (err) {
                console.log("error"+err);
                reject('error'+err);
            } else if (rows) {
                for (let i = 0; i < rows.length; i++) {
                    let results={};
                    rows[i].forEach(function(row){
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