"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (appInfo) => {
    const config = {};
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
            ctx.body = JSON.stringify({ ret: -1, msg: err.toString(), data: null });
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
        publicKey: fs_1.readFileSync(path_1.join(appInfo.baseDir, '../', 'auth_key/public_key.pem')).toString(),
        privateKey: fs_1.readFileSync(path_1.join(appInfo.baseDir, '../', 'auth_key/private_key.pem')).toString(),
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
        accessKeyId: 'TFRBSTRGcGNBRWdCWm05UHlON3BhY0tU',
        accessKeySecret: 'M2NBYmRwQ1VESnpCa2ZDcnVzN1d2SXc1alhmNDNF'
    };
    config.uploadConfig = {
        aliOss: {
            enable: true,
            isCryptographic: true,
            accessKeyId: 'TFRBSTRGcGNBRWdCWm05UHlON3BhY0tU',
            accessKeySecret: 'M2NBYmRwQ1VESnpCa2ZDcnVzN1d2SXc1alhmNDNF',
            bucket: 'freelog-image',
            internal: false,
            region: 'oss-cn-shenzhen',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkJBQWdDO0FBQ2hDLCtCQUEwQjtBQUUxQixrQkFBZSxDQUFDLE9BQW1CLEVBQUUsRUFBRTtJQUNuQyxNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7SUFFdkIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUUsSUFBSTtTQUNiO0tBQ0osQ0FBQztJQUVGLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixNQUFNLEVBQUUsSUFBSTtRQUNaLGFBQWEsRUFBRSxPQUFPO0tBQ3pCLENBQUM7SUFFRixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsc0JBQXNCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHO1FBQ1osTUFBTSxFQUFFLEtBQUs7S0FDaEIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1lBQzlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ3RFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLENBQUM7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE1BQU0sRUFBRTtZQUNKLE1BQU0sRUFBRSxLQUFLO1NBQ2hCO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsTUFBTSxFQUFFLEtBQUs7U0FDaEI7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztRQUNiLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLFNBQVMsRUFBRSxpQkFBWSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO1FBQzNGLFVBQVUsRUFBRSxpQkFBWSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0tBQ2hHLENBQUM7SUFFRixNQUFNLENBQUMsbUJBQW1CLEdBQUc7UUFDekIsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixJQUFJLEVBQUUsR0FBRztRQUNULE1BQU0sRUFBRSxJQUFJO1FBQ1osSUFBSSxFQUFFO1lBQ0YsSUFBSSxFQUFFLDZCQUE2QjtZQUNuQyxJQUFJLEVBQUUsZUFBZTtTQUN4QjtLQUNKLENBQUM7SUFFRixNQUFNLENBQUMsWUFBWSxHQUFHO1FBQ2xCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLFdBQVcsRUFBRSxrQ0FBa0M7UUFDL0MsZUFBZSxFQUFFLDBDQUEwQztLQUM5RCxDQUFDO0lBRUYsTUFBTSxDQUFDLFlBQVksR0FBRztRQUNsQixNQUFNLEVBQUU7WUFDSixNQUFNLEVBQUUsSUFBSTtZQUNaLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFdBQVcsRUFBRSxrQ0FBa0M7WUFDL0MsZUFBZSxFQUFFLDBDQUEwQztZQUMzRCxNQUFNLEVBQUUsZUFBZTtZQUN2QixRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsT0FBTyxFQUFFLE1BQU07U0FDbEI7UUFDRCxLQUFLLEVBQUUsRUFBRTtLQUNaLENBQUM7SUFFRixNQUFNLENBQUMsb0JBQW9CLEdBQUc7UUFDMUIsUUFBUSxFQUFFLElBQUk7UUFDZCxTQUFTLEVBQUUsa0NBQWtDO1FBQzdDLFVBQVUsRUFBRSxrQ0FBa0M7S0FDakQsQ0FBQztJQUVGLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyJ9