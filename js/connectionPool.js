const mysql = require('mysql');

const pool = mysql.createPool({
    queueLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'hhhh',
    database: 'data',
    port: 3306
});

module.exports = pool; 