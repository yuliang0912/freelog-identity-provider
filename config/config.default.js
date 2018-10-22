'use strict';

const fs = require('fs')

module.exports = appInfo => {

    const config = {

        cluster: {
            listen: {
                port: 7011
            }
        },

        middleware: ['errorHandler', 'identiyAuthentication'],

        /**
         * DB-mysql相关配置
         */
        knex: {
            /**
             * 用户相关DB配置
             */
            user: {
                client: 'mysql',
                connection: {
                    host: '127.0.0.1',
                    user: 'root',
                    password: 'yuliang@@',
                    database: 'fr_user_info',
                    charset: 'utf8',
                    timezone: '+08:00',
                    bigNumberStrings: true,
                    supportBigNumbers: true,
                    connectTimeout: 2000
                },
                pool: {max: 10, min: 2},
                acquireConnectionTimeout: 800,
                debug: false
            },
        },

        /**
         * mongoDB配置
         */
        mongoose: {
            url: "mongodb://localhost:27017/group",
        },

        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: false,
            }
        },

        gatewayUrl: "http://api.freelog.com",

        jwtAuth: {
            cookieName: 'authInfo',
            privateKey: fs.readFileSync('config/auth_key/private_key.pem').toString(),
            publicKey: fs.readFileSync('config/auth_key/public_key.pem').toString()
        },

        domain: "freelog.com",


        /**
         * 上传文件相关配置
         */
        uploadConfig: {
            aliOss: {
                enable: true,
                accessKeyId: "LTAIy8TOsSnNFfPb",
                accessKeySecret: "Bt5yMbW89O7wMTVQsNUfvYfou5GPsL",
                bucket: "freelog-image",
                internal: false,
                region: "oss-cn-shenzhen",
                timeout: 180000
            },
            amzS3: {}
        },

        //cookie加密与解密key
        keys: 'd5dd9d6d5d9aa0f36c00b779fa7e3cf4,6a40eb7a1d7d01d508af102a151ab56f'
    };

    return config;
};
