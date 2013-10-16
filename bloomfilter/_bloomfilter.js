/**
 * Created with JetBrains WebStorm.
 * User: lvleibing01
 * Date: 13-10-16
 * Time: 下午5:14
 * To change this template use File | Settings | File Templates.
 */

var util = require('util');
var BloomFilter = require('bloomfilter').BloomFilter;

module.exports = _BloomFilter;

function _BloomFilter(conf){

    if(conf === undefined){
        conf = require('./bloomfilterConfig');
    }

    var m = conf.m;
    var n = conf.n;
    var k = Math.ceil( Math.log(2) * m / n);

    BloomFilter.call(this, m, k);

}

util.inherits(_BloomFilter, BloomFilter);

