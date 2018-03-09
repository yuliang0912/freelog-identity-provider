/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    /**
     * DB-mysql相关配置
     */
    knex: {
        user: {
            connection: {
                host: 'rm-wz93t7g809kthrub7.mysql.rds.aliyuncs.com',
                user: 'freelog_test',
                password: 'Ff@233109',
                database: 'fr_user_info',
            },
            debug: false
        },
    },


    mongoose: {
        url: "mongodb://172.18.215.229:27017/group"
    },


    /**
     * api网关内网地址
     */
    gatewayUrl: "http://172.18.215.224:8895/test",
}