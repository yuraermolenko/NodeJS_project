var mysql = require('mysql');

module.exports = {
    counter:0,
    item: {},
    tableRows: '',
    // выбор всех элементов и отображение в виде таблицы 
    getAllItems: function (connection) {
        var self = this;
        var query = connection.query('SELECT * FROM `projects`', function (err, rows) {
            if (err) console.log(err)

            // генерация рядов таблицы на основе полученных данных  
            var table_rows = rows.map((row) => {
                return (`  <li class="works-item">
                        <img src=${row.src} />
                        <div class="works-item-mask">
                            <span class="mask-content">
                                <div>
                                    <a data-id=${row.id} ><i data-id=${row.id} class="fa fa-edit"></i></a>
                                    <a data-id=${row.id} ><i data-id=${row.id} class="fa fa-info"></i></a>
                                </div>
                                <a data-id=${row.id}  class="link-delete"><i data-id=${row.id} class="fa fa-remove"></i></a>
                            </span>
                        </div>
                    </li> `)
            })

            self.tableRows = table_rows.join(' ');

        });
        return query;
    },
    getCategory: function (id, connection) {
        var self = this;
        if (id == "all") return this.getAllItems(connection);
     
        var query = connection.query('SELECT * FROM `projects` WHERE CATEGORY=?', [id], function (err, rows) {
            if (err) console.log(err)

            // генерация рядов таблицы на основе полученных данных  
            var table_rows = rows.map((row) => {
                return (`  <li class="works-item">
                        <img src=${row.src} />
                        <div class="works-item-mask">
                            <span class="mask-content">
                                <div>
                                    <a data-id=${row.id} ><i data-id=${row.id} class="fa fa-edit"></i></a>
                                    <a data-id=${row.id} ><i data-id=${row.id} class="fa fa-info"></i></a>
                                </div>
                                <a data-id=${row.id}  class="link-delete"><i data-id=${row.id} class="fa fa-remove"></i></a>
                            </span>
                        </div>
                    </li> `)
            })

            self.tableRows = table_rows.join(' ');

        });
        return query;
    },
    getItemById: (id, connection) => {
        var self = this;
        var query = connection.query('SELECT * FROM `projects` WHERE id=?', [id], function (err, rows) {
            if (err) console.log(err);
            self.item = rows[0];
            console.log(self.item);
        });
        return query;
    },
    updateItem:(data, id, connection) => {
    var sql = 'UPDATE `projects` SET title=?, description=?, author=?, category=? WHERE id=?';
    var inserts = [data.title, data.description, data.author, data.category, id];
    sql = mysql.format(sql, inserts);

    var query = connection.query(sql, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('database updated');
        }
    });
    return query; 
    },
    removeItem: function (id, connection) {
        // форматирование запроса 
        var sql = 'DELETE FROM `projects` WHERE id=?';
        var inserts = id;
        sql = mysql.format(sql, inserts);

        // запрос к бд 
        return connection.query(sql, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('item removed from database!');
            }
        })
    },
    addItem: (data, src, connection) => {
        var self = this;
        var date = new Date();
        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        var yyyy = date.getFullYear();
       
        date = yyyy + '-' + mm + '-' + dd;

        
        

        var sql = 'INSERT INTO `projects` (title, author, description, category, src, date  ) VALUES (?, ?, ?, ?, ?, ?)'
        var inserts = [data.title, data.author, data.description, data.category, src, date];
        console.log(inserts);
        var sql = mysql.format(sql, inserts);

        // запрос к бд 
        return query = connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('item added into database!');
        })
    }
}