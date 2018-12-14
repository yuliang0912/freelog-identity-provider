'use strict'

module.exports = appInfo => {

    return {

        /**
         * DB-mysql相关配置
         */
        knex: {
            user: {
                connection: {
                    host: '172.18.215.231',
                    user: 'root',
                    password: 'Ff@233109',
                    database: 'fr_user_info',
                },
                debug: false
            },
        },


        uploadConfig: {
            aliOss: {
                internal: true
            },
            amzS3: {}
        },

        /**
         * mongoDB配置
         */
        mongoose: {
            url: "mongodb://172.18.215.231:27017/user",
        },

        /**
         * api网关内网地址
         */
        gatewayUrl: "http://172.18.215.224:8895",
    }
}