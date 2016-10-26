var mysql = require('mysql');
var pool = require('./connectionPool');

var queries = require('./queries');

module.exports = {
    displayItems: function (req, res) {
        pool.getConnection(function (err, connection) {

            var query = queries.getAllItems(connection);

            query.on('end', function () {

                res.render('home', { data: queries.tableRows });
                connection.release();
            })

        })
    },
    displayCategory: (req, res) => {
        pool.getConnection((err, connection) => {
            var query = queries.getCategory(req.params.id, connection);
            query.on('end', () => {
                res.end(queries.tableRows);
                connection.release();
            })
        })
    }
}