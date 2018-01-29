'use strict';

const fs = require('fs')
const Promise = require('bluebird')

module.exports = appInfo => {

    const config = {

        middleware: ['errorHandler', 'identiyAuthentication'],

        /**
         * DB-mysql相关配置
         */
        dbConfig: {
            /**
             * 用户相关DB配置
             */
            user: {
                client: 'mysql2',
                connection: {
                    host: '192.168.0.99',
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
                debug: false
            },
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
            publickKey: fs.readFileSync('config/auth_key/public_key.pem').toString()
        },

        //cookie加密与解密key
        keys: 'd5dd9d6d5d9aa0f36c00b779fa7e3cf4,6a40eb7a1d7d01d508af102a151ab56f'
    };

    return config;
};
