const mysql = require('mysql2');
var cont = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "12345678",
    database: 'carshowroom'
  });
  
cont.connect(function(err) {
    if (err) throw err;
});

module.exports = cont;