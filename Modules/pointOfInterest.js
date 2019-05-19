const express = require("express");
const azureControler = require("../dbControllers/azureDb");
const app = express();

// ENABLES US TO PARSE JSON'S DIRECTLY FROM REQ/RES
function jsoniFy(sqlRows){
    return {};
}
module.exports.getAll =  function(){
  let results={};
  return new Promise((resolve, reject)=>{
      azureControler.runQuery("SELECT * FROM POI", function(err, rows) {
          if (err) {
              console.log("error"+err);
              reject('error'+err);
          } else if (rows) {
              rows[0].forEach(function(row){
                  results[row['col']]=row.val;
              });
              resolve(results);
          } else {
              // return null;
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
                // return null;
            }
        });
    });
};
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
                // return null;
            }
        });
    });
};
