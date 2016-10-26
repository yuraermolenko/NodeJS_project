var mysql = require('mysql');
var pool = require('./connectionPool');

var queries = require('./queries');
module.exports = {
    item: {},
    showEditPage: (req, res) => {
        var self = this;
            pool.getConnection(function (err, connection) {

                var query = connection.query('SELECT * FROM `projects` WHERE id=?', [req.params.id], function (err, rows) {
                    if (err) console.log(err);
                    self.item = rows[0];
                    
                })

                query.on('end', function () {                   
                    res.render('edit', { item: self.item});
                 
                    connection.release();
                })

            })
        
    },
    uploadItem: (req, res) => {
        pool.getConnection(function (err, connection) {
            // запрос к бд 
            var query = queries.updateItem(req.body,req.params.id, connection);

            query.on('end', function () {
                //res.redirect('/home');
                res.end();
                
                // завершение соединения 
                connection.release();

            });
        });
    },
    removeItem: (req, res) => {
        pool.getConnection(function (err, connection) {
            // запрос к бд 
            var query = queries.removeItem(req.params.id, connection);

            query.on('end', function () {
                res.end();
                // завершение соединения 
                connection.release();

            })
        })
    },
    showInfo: (req, res) => {
        var self = this;
        pool.getConnection((err, connection)=> {
            var query = connection.query('SELECT * FROM `projects` WHERE id=?', [req.params.id], function (err, rows) {
                if (err) console.log(err);
                self.item = rows[0];

            })

            query.on('end', function () {
                var date = self.item.date;              
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December'];
                var dd = date.getDate();
                var mm = months[date.getMonth()];
                var yyyy = date.getFullYear();
                var strDate = dd + ' ' + mm + ', ' + yyyy; 
                res.render('info', { item: self.item, date:strDate });

                connection.release();
            })
        })
    }
}
