const cookieParser = require('cookie-parser');
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);


const sessionStore = new mySQLStore({
    queueLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'hhhh',
    database: 'data',
    port: 3306
});

module.exports = sessionStore;