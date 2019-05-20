const azureControler = require("../dbControllers/azureDb");

module.exports.getAll =  function(){
    let resultsArray=[];
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT * FROM Questions", function(err, rows) {
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
                // return null;
            }
        });
    });
};