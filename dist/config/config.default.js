"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const areaList = require('./pcas-code.json');
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
        publicKey: (0, fs_1.readFileSync)((0, path_1.join)(appInfo.baseDir, '../', 'auth_key/public_key.pem')).toString(),
        privateKey: (0, fs_1.readFileSync)((0, path_1.join)(appInfo.baseDir, '../', 'auth_key/private_key.pem')).toString(),
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
    config.areaList = areaList;
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkJBQWdDO0FBQ2hDLCtCQUEwQjtBQUUxQixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUU3QyxrQkFBZSxDQUFDLE9BQW1CLEVBQUUsRUFBRTtJQUNuQyxNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7SUFFdkIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUUsSUFBSTtTQUNiO0tBQ0osQ0FBQztJQUVGLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixNQUFNLEVBQUUsSUFBSTtRQUNaLGFBQWEsRUFBRSxPQUFPO0tBQ3pCLENBQUM7SUFFRixNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsc0JBQXNCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUUzRSxNQUFNLENBQUMsTUFBTSxHQUFHO1FBQ1osTUFBTSxFQUFFLEtBQUs7S0FDaEIsQ0FBQztJQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1lBQzlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ3RFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLENBQUM7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE1BQU0sRUFBRTtZQUNKLE1BQU0sRUFBRSxLQUFLO1NBQ2hCO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsTUFBTSxFQUFFLEtBQUs7U0FDaEI7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztRQUNiLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLFNBQVMsRUFBRSxJQUFBLGlCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtRQUMzRixVQUFVLEVBQUUsSUFBQSxpQkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7S0FDaEcsQ0FBQztJQUVGLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRztRQUN6QixJQUFJLEVBQUUsbUJBQW1CO1FBQ3pCLElBQUksRUFBRSxHQUFHO1FBQ1QsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUU7WUFDRixJQUFJLEVBQUUsNkJBQTZCO1lBQ25DLElBQUksRUFBRSxlQUFlO1NBQ3hCO0tBQ0osQ0FBQztJQUVGLE1BQU0sQ0FBQyxZQUFZLEdBQUc7UUFDbEIsZUFBZSxFQUFFLElBQUk7UUFDckIsV0FBVyxFQUFFLGtDQUFrQztRQUMvQyxlQUFlLEVBQUUsMENBQTBDO0tBQzlELENBQUM7SUFFRixNQUFNLENBQUMsWUFBWSxHQUFHO1FBQ2xCLE1BQU0sRUFBRTtZQUNKLE1BQU0sRUFBRSxJQUFJO1lBQ1osZUFBZSxFQUFFLElBQUk7WUFDckIsV0FBVyxFQUFFLGtDQUFrQztZQUMvQyxlQUFlLEVBQUUsMENBQTBDO1lBQzNELE1BQU0sRUFBRSxlQUFlO1lBQ3ZCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsTUFBTSxFQUFFLGlCQUFpQjtZQUN6QixPQUFPLEVBQUUsTUFBTTtTQUNsQjtRQUNELEtBQUssRUFBRSxFQUFFO0tBQ1osQ0FBQztJQUVGLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRztRQUMxQixRQUFRLEVBQUUsSUFBSTtRQUNkLFNBQVMsRUFBRSxrQ0FBa0M7UUFDN0MsVUFBVSxFQUFFLGtDQUFrQztLQUNqRCxDQUFDO0lBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFFM0IsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFDIn0=