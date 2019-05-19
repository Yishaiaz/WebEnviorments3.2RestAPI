const azureControler = require("../dbControllers/azureDb");

module.exports.getAll =  function(){
    let results={};
    return new Promise((resolve, reject)=>{
        azureControler.runQuery("SELECT * FROM Questions", function(err, rows) {
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