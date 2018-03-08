'use strict'

module.exports = appInfo => {

    return {

        /**
         * DB-mysql相关配置
         */
        knex: {
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


        mongoose: {
            url: "mongodb://root:Ff233109@dds-wz9b5420c30a27941546-pub.mongodb.rds.aliyuncs.com:3717,dds-wz9b5420c30a27942267-pub.mongodb.rds.aliyuncs.com:3717/group?replicaSet=mgset-5016983"
        },


        /**
         * api网关内网地址
         */
        gatewayUrl: "http://172.18.215.224:8895",
    }
}