'use strict';

const fs = require('fs')

module.exports = appInfo => {

    const config = {

        cluster: {
            listen: {
                port: 7011
            }
        },

        i18n: {
            enable: true,
            defaultLocale: 'zh-CN'
        },

        middleware: ['errorHandler', 'identityAuthentication'],

        /**
         * mongoDB配置
         */
        mongoose: {
            url: "mongodb://localhost:27017/user",
        },

        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: false,
            }
        },

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
                isCryptographic: true,
                accessKeyId: "TFRBSXk4VE9zU25ORmZQYg==",
                accessKeySecret: "QnQ1eU1iVzg5Tzd3TVRWUXNOVWZ2WWZvdTVHUHNM",
                bucket: "freelog-shenzhen",
                internal: false,
                region: "oss-cn-shenzhen",
                timeout: 180000
            },
            amzS3: {}
        },

        smtpTransportConfig: {
            host: 'smtpdm.aliyun.com',
            port: 465,
            secure: true,
            auth: {
                user: 'noreply@service.freelog.com',
                pass: 'FreeLog233109'
            }
        },

        //cookie加密与解密key
        keys: 'd5dd9d6d5d9aa0f36c00b779fa7e3cf4,6a40eb7a1d7d01d508af102a151ab56f',

        clientCredentialInfo: {
            clientId: 1001,
            publicKey: 'c2390e26867d04fbcf1f07bec47ba779',
            privateKey: '96d8bd08230d2f3052f4df986c2b8ce9'
        },
    };

    return config;
};
