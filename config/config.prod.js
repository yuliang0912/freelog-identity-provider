'use strict'

module.exports = appInfo => {

    return {

        /**
         * DB-mysql相关配置
         */
        dbConfig: {
            user: {
                connection: {
                    host: 'rm-wz9wj9435a0428942.mysql.rds.aliyuncs.com',
                    user: 'freelog',
                    password: 'Ff@233109',
                    database: 'fr_user_info',
                },
                debug: false
            },
        },

        /**
         * api网关内网地址
         */
        gatewayUrl: "http://39.108.77.211",
    }
}