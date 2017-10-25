/**
 * Created by yuliang on 2017-06-28.
 * 生产环境DB配置
 */

const Promise = require('bluebird')

module.exports = {
    /**
     * 用户相关DB配置
     */
    user: {
        client: 'mysql2',
        connection: {
            host: '192.168.0.3',
            user: 'root',
            password: 'yuliang@@',
            database: 'fr_user_info',
            charset: 'utf8',
            timezone: '+08:00',
            bigNumberStrings: true,
            supportBigNumbers: true,
            connectTimeout: 10000,
            Promise: Promise
        },
        pool: {
            maxConnections: 50,
            minConnections: 2,
        },
        acquireConnectionTimeout: 10000,
        debug: true
    },
}