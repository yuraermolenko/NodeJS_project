const cookieParser = require('cookie-parser');
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);


const sessionStore = new mySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'qwerrewqasdffdsa',
    database: 'data',
    checkExpirationInterval: 900000,
    expiration: 86400000
});

module.exports = sessionStore;