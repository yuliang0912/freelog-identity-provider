import {EggAppInfo} from 'midway';
import {readFileSync} from 'fs';
import {join} from "path";

export default (appInfo: EggAppInfo) => {
    const config: any = {};

    config.keys = appInfo.name;

    config.cluster = {
        listen: {
            port: 7111
        }
    };


    config.i18n = {
        enable: true,
        defaultLocale: 'zh-CN'
    };

    config.middleware = ['errorAutoSnapHandler', 'gatewayIdentityInfoHandler'];

    config.static = {
        enable: false
    };

    config.onerror = {
        all(err, ctx) {
            ctx.type = 'application/json';
            ctx.body = JSON.stringify({ret: -1, msg: err.toString(), data: null});
            ctx.status = 500;
        }
    };

    config.security = {
        xframe: {
            enable: false,
        },
        csrf: {
            enable: false,
        }
    };

    config.jwtAuth = {
        cookieName: 'authInfo',
        publicKey: readFileSync(join(appInfo.baseDir, '../', 'auth_key/public_key.pem')).toString(),
        privateKey: readFileSync(join(appInfo.baseDir, '../', 'auth_key/private_key.pem')).toString(),
    };

    config.smtpTransportConfig = {
        host: 'smtpdm.aliyun.com',
        port: 465,
        secure: true,
        auth: {
            user: 'noreply@service.freelog.com',
            pass: 'FreeLog233109'
        }
    };

    config.aliYunSecret = {
        isCryptographic: true,
        accessKeyId: "TFRBSTRGcGNBRWdCWm05UHlON3BhY0tU",
        accessKeySecret: "M2NBYmRwQ1VESnpCa2ZDcnVzN1d2SXc1alhmNDNF"
    };

    config.uploadConfig = {
        aliOss: {
            enable: true,
            isCryptographic: true,
            accessKeyId: "TFRBSTRGcGNBRWdCWm05UHlON3BhY0tU",
            accessKeySecret: "M2NBYmRwQ1VESnpCa2ZDcnVzN1d2SXc1alhmNDNF",
            bucket: "freelog-image",
            internal: false,
            region: "oss-cn-shenzhen",
            timeout: 180000
        },
        amzS3: {}
    };

    config.clientCredentialInfo = {
        clientId: 1001,
        publicKey: 'c2390e26867d04fbcf1f07bec47ba779',
        privateKey: '96d8bd08230d2f3052f4df986c2b8ce9'
    };

    return config;
};
