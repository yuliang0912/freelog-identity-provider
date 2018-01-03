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

        gatewayUrl: "http://192.168.0.99:1201",

        jwtAuth: {
            cookieName: 'authInfo',
            privateKey: fs.readFileSync('config/auth_key/private_key.pem').toString(),
            publickKey: fs.readFileSync('config/auth_key/public_key.pem').toString()
        }
    };

    // should change to your own
    config.keys = appInfo.name + '_1502781712068_5353';

    return config;
};
