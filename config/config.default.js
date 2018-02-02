'use strict';

const fs = require('fs')

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
                client: 'mysql',
                connection: {
                    host: '192.168.0.99',
                    user: 'root',
                    password: 'yuliang@@',
                    database: 'fr_user_info',
                    charset: 'utf8',
                    timezone: '+08:00',
                    bigNumberStrings: true,
                    supportBigNumbers: true,
                    connectTimeout: 10000
                },
                pool: {
                    max: 10, min: 2,
                    afterCreate: (conn, done) => {
                        conn.on('error', err => {
                            console.log(`mysql connection error : ${err.toString()}`)
                            err.fatal && globalInfo.app.knex.resource.client.pool.destroy(conn)
                        })
                        done()
                    }
                },
                acquireConnectionTimeout: 800,
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
