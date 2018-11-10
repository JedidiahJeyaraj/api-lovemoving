"use strict";
var mysql = require('mysql')

var appconfig = {};

// appconfig.getConnection = function(){
//     var connection = mysql.createConnection({
//     host     : 'db4free.net',
//     user     : 'umakant',
//     password : 'umakantmane',
//     database : 'lovemoving',
//     port:3306
//     });
//     connection.connect();

//     return connection;
// };


appconfig.getConnection = function(){
    var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'umakant',
    password : 'welcome@123',
    database : 'lovemoving',
    port:3306
    });
    connection.connect();

    return connection;
};


module.exports = appconfig;
