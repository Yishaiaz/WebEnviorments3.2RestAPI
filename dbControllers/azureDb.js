
module.exports.queryDatabase= function (sqlQuery)
{
    function queryDataBase(query){
        console.log('Reading rows from the Table...');

        // Read all rows from table
        var request = new Request(query,
            function(err, rowCount, rows)
            {
                console.log(rowCount + ' row(s) returned');
                process.exit();
            }
        );

        request.on('row', function(columns) {
            columns.forEach(function(column) {
                console.log("%s\t%s", column.metadata.colName, column.value);
            });
        });
        connection.execSql(request);
    }
    var Connection = require('tedious').Connection;
    var Request = require('tedious').Request;
    // Create connection to database
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
                    database: 'TutorialDb', //update me
                    encrypt: true
                }
        };
    var connection = new Connection(config);
    // console.log(connection);
// Attempt to connect and execute queries if connection goes through
    connection.on('connect', function(err)
        {
            console.log("hello");
            if (err)
            {
                console.log(err+"hey")
            }
            else
            {
                queryDataBase(sqlQuery);
            }
        }
    );
};
