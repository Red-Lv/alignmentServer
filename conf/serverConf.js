/**
 * Created with JetBrains WebStorm.
 * User: lvleibing01
 * Date: 13-10-16
 * Time: 下午8:00
 * To change this template use File | Settings | File Templates.
 */

var conf = {
    bloomfilter: {
        m: 8 * 1024 * 1024 * 20,
        n: 1024 * 1024
    },
    db: [
        {
            host: '10.50.42.76',
            port: 5195,
            user: 'novelclu_rd',
            password: 'j8r5e2Ik51de74',
            database: 'novels_new',
            supportBigNumbers: true
        }
    ]
};

module.exports = conf;
