const cookieParser = require('cookie-parser');
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);


const sessionStore = new mySQLStore({
    host: 'nodejs-8267.mysql.dbs.appsdeck.eu',
    user: 'nodejs_8267',
    password: 'GTm56QFAngJ3H36ZfsTi',
    database: 'nodejs_8267',
    port: 30895
    checkExpirationInterval: 900000,
    expiration: 86400000
});

module.exports = sessionStore;