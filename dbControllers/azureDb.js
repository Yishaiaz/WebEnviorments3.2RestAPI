var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

export function queryDatabase(sqlQuery)
{
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
                    database: 'Assignment3db', //update me
                    encrypt: true
                }
        };
    var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
    connection.on('connect', function(err)
        {
            if (err)
            {
                console.log(err)
            }
            else
            {
                queryDatabase()
            }
        }
    );
    console.log('your query: '+ sqlQuery);

    // Read all rows from table
    var request = new Request(
        sqlQuery,
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');
            process.exit();
        }
    );
//prints out the actual data
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
}
