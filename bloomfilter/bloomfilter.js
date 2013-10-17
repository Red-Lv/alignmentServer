/**
 * Created with JetBrains WebStorm.
 * User: lvleibing01
 * Date: 13-10-16
 * Time: 下午5:14
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var util = require('util');
var BloomFilter = require('bloomfilter').BloomFilter;

module.exports = _BloomFilter;

function _BloomFilter(conf){

    if(conf === undefined){
        conf = require('./bloomfilterConfig');
    }

    this.m = conf.m;
    this.n = conf.n;
    this.k = Math.ceil( Math.log(2) * m / n);
    this.backFile = conf.backupFile;
    this.bucketsBackup = new Array();

    this.recover();

    if(this.bucketsBackup.length == 0){
        BloomFilter.call(this, m, k);
    }else{
        BloomFilter.call(this, this.bucketsBackup, k);
    }

}

util.inherits(_BloomFilter, BloomFilter);

_BloomFilter.prototype.recover = function (){

    fs.readFile(this.backFile, function(err, data){

        if(err){
           throw err;
        }

        var obj = JSON.parse(data.toString())

        if(obj){

            if(obj.m === this.m){
                this.bucketsBackup = obj.buckets;
            }

        }

    })

};

_BloomFilter.prototype.backup = function (){

    fs.writeFile(this.backFile, JSON.stringify({m: this.m, buckets: this.buckets}), function(err){
        util.log(util.format('[backup] m: %d, buckets: %d', this.m, this.buckets.length))
    })

};

