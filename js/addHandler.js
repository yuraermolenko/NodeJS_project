var mysql = require('mysql');
var pool = require('./connectionPool');

var queries = require('./queries');
module.exports = {
    addItem: function (req, res) {
        var src = "uploads/" + req.file.originalname;
        // подключение к бд 
        pool.getConnection(function (err, connection) {
            var query = queries.addItem(req.body, src, connection);
            query.on('end', function () {
                res.redirect('/home');
                res.end();
               
                // завершение соединения 
                connection.release();
            })
        })
    }
}