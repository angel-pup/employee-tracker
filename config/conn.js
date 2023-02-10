// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'vess',
  database: 'gest-rec-MYSQL-7302'
});

module.exports = connection;