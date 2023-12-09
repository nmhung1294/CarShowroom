const mysql = require('mysql2');
var cont = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "12345678",
    database: 'carshowroom'
  });
module.exports = cont;