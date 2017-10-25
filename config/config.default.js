'use strict';

const fs = require('fs')
const dbConfig = require('./db_config/dbconfig_local')

module.exports = appInfo => {

    const config = {

        middleware: ['errorHandler'],

        /**
         * DB-mysql相关配置
         */
        dbConfig: dbConfig,

        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: false,
            }
        },

        gatewayUrl: "http://192.168.0.3:1201",

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
