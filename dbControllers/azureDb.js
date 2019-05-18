var Connection = require('tedious').Connection;


var config =
    {
        authentication: {
            options: {
                userName: 'tamir', // update me
                password: 'Db123456' // update me
            },
            type: 'default'
        },
        server: 'appwebserver2.database.windows.net', // update me
        options:
            {
                database: 'Assignment3db', //update me
                encrypt: true
            }
    };



module.exports.runQuery = function(sqlQuery, callback){
    var connection = new Connection(config);
    var newdata = [];
    var dataset = [];
    connection.on('connect', function(err) {
        var Request = require('tedious').Request;
        var request = new Request(sqlQuery, function (err, rowCount) {
            if (err) {
                callback(err);
            } else {
                if (rowCount < 1) {
                    callback(null, false);
                } else {
                    callback(null, newdata);
                }
            }
        });
        request.on('row', function(columns) {
            var dataset=[];
            columns.forEach(function(column) {
                dataset.push({
                    col: column.metadata.colName,
                    val: column.value
                });
            });
            newdata.push(dataset);
        });
        connection.execSql(request);
    });

};