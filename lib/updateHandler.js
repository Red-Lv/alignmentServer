/**
 * Created with JetBrains WebStorm.
 * User: lvleibing01
 * Date: 13-10-16
 * Time: 下午6:10
 * To change this template use File | Settings | File Templates.
 */

var util = require('util');
var mysql = require('mysql');

module.exports = UpdateHandler;
function UpdateHandler(bloomfilter, db){

    this.bloomfilter = bloomfilter;
    this.db = db;

    this.last_proc_time = Math.floor(new Date().getTime() / 1000);

    this.init_db();

}

UpdateHandler.prototype.init_db = function (){

    this.poolCluster = mysql.createPoolCluster();

    for(var i = 0; i < this.db.length; i ++){
        this.poolCluster.add('db_' + i, this.db[i]);
    }

};

UpdateHandler.prototype.start = function(){

    var self = this;

    this.poolCluster.getConnection(function(err, connection){

        if(err){

            if(connection){
                connection.release();
            }

            throw err;

        }

        var cur_proc_time = Math.floor(new Date().getTime() / 1000);
        var no_of_table_remained = 256;

        for(var table_id = 0; table_id < 256; table_id ++){

            (function (table_id){

                var table_name = 'integrate_chapter_info' + table_id;
                var query_sql = util.format('SELECT chapter_id FROM %s WHERE update_time > %d and update_time <= %d', table_name, self.last_proc_time, cur_proc_time);

                var query = connection.query(query_sql);
                var records_update = 0;

                query
                    .on('error', function(err){

                        util.log(util.format('[update] table_name: %s, error: %s', table_name, err));

                    })
                    .on('fields', function(fields){

                    })
                    .on('result', function(row){

                        connection.pause();

                        records_update += 1;
                        self.bloomfilter.add(row['chapter_id']);
                        util.log(util.format('[update] table_name: %s, chapter_id: %s', table_name, row['chapter_id']));

                        connection.resume();

                    })
                    .on('end', function(){

                        util.log(util.format('[update] table_name: %s, records_update: %d', table_name, records_update));

                        no_of_table_remained -= 1;

                        if(no_of_table_remained == 0){

                            connection.release();

                            self.last_proc_time = cur_proc_time;
                            setTimeout(self.start.bind(self), 60000);

                        }

                    });

                /*
                connection.query(query_sql, function(err, rows, fields){

                    for(var index in rows){
                        var row = rows[index];
                        self.bloomfilter.add(row['chapter_id']);
                        util.log(util.format('[update] %s', row['chapter_id']));
                    }

                    no_of_table_remained -= 1;

                    if(no_of_table_remained == 0){

                        connection.release();

                        self.last_proc_time = cur_proc_time;
                        setTimeout(self.start.bind(self), 60000);

                    }

                });
                */

            })(table_id);

        }

    });

};

