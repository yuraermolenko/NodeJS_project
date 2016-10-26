const mysql = require('mysql');

const pool = mysql.createPool({
    queueLimit: 10,
    host: 'nodejs-8267.mysql.dbs.appsdeck.eu',
    user: 'nodejs_8267',
    password: 'GTm56QFAngJ3H36ZfsTi',
    database: 'nodejs_8267',
    port: 30895
});

module.exports = pool; 