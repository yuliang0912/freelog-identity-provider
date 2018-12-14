/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    cluster: {
        listen: {port: 5011}
    },

    /**
     * DB-mysql相关配置
     */
    knex: {
        user: {
            connection: {
                host: '172.18.215.231',
                user: 'root',
                port: 3307,
                password: 'Ff@233109',
                database: 'fr_user_info',
            },
            debug: false
        },
    },


    mongoose: {
        url: "mongodb://172.18.215.231:27018/user",
    },


    /**
     * api网关内网地址
     */
    gatewayUrl: "http://172.18.215.224:8895/test",

    domain: "testfreelog.com"
}