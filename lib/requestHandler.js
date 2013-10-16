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

module.exports = requestHandler;
function requestHandler(bloomfilter){

    this.bloomfilter = bloomfilter;

}

requestHandler.prototype.response = function(req, res){

    var urlObj = url.parse(req.url);
    var queryObj = querystring.parse(urlObj.query);

    res.writeHead(200, {"Content-Type": "text/plain"});

    var key = queryObj['chapter_id'];
    var result = false;

    if(key && this.bloomfilter.test(key)){
        result = true;
    }

    res.write(util.format('%s: %s', key, result));
    res.end();

};

