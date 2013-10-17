/**
 * Created with JetBrains WebStorm.
 * User: lvleibing01
 * Date: 13-10-16
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */

var url = require('url');
var util = require('util');
var querystring = require('querystring');

module.exports = RequestHandler;
function RequestHandler(bloomfilter){

    this.bloomfilter = bloomfilter;

}

RequestHandler.prototype.response = function(req, res){

    var urlObj = url.parse(req.url);
    var queryObj = querystring.parse(urlObj.query);

    res.writeHead(200, {"Content-Type": "text/plain"});

    var chapter_id = queryObj['chapter_id'];
    var result = false;

    if(chapter_id && this.bloomfilter.test(chapter_id)){
        result = true;
    }

    res.write(util.format('%s: %s', chapter_id, result));
    res.end();

    util.log(util.format('[query] ip: %s chapter_id: %s, result: %s', req.connection.remoteAddress, chapter_id, result));

};

