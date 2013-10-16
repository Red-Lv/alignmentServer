/**
 * Created with JetBrains WebStorm.
 * User: lvleibing01
 * Date: 13-10-16
 * Time: 下午7:58
 * To change this template use File | Settings | File Templates.
 */

var http = require('http');

var conf = require('./conf/serverConf');
var bloomfilter = new (require('./bloomfilter/bloomfilter'))();
var requestHandler = new (require('./lib/requestHandler'))(bloomfilter);
var updateHandler = new (require('./lib/updateHandler'))(bloomfilter, conf.db);

updateHandler.start();

http.createServer(function (req, res){

    requestHandler.response(req, res);

}).listen(9891);
