"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.development = void 0;
exports.development = {
    watchDirs: [
        'app',
        'controller',
        'lib',
        'service',
        'extend',
        'config',
        'app.ts',
        'agent.ts',
        'interface.ts',
    ],
    overrideDefault: true
};
exports.default = () => {
    const config = {};
    config.middleware = ['errorAutoSnapHandler', 'gatewayIdentityInfoHandler', 'localIdentityInfoHandler'];
    /**
     * mongoDB配置
     */
    config.mongoose = {
        url: 'mongodb://localhost:27017/user',
    };
    config.mongoose = {
        url: decodeURIComponent(`mongodb%3A%2F%2Fuser_service%3AQzA4Qzg3QTA3NDRCQTA0NDU1RUQxMjI3MTA4ODQ1MTk%3D%40dds-wz9ac40fee5c09441604-pub.mongodb.rds.aliyuncs.com%3A3717%2Cdds-wz9ac40fee5c09442584-pub.mongodb.rds.aliyuncs.com%3A3717%2Ftest-users%3FreplicaSet%3Dmgset-44484047`)
    };
    // config.mongoose = {
    //     url: decodeURIComponent('mongodb%3A%2F%2Fuser_service%3AQzA4Qzg3QTA3NDRCQTA0NDU1RUQxMjI3MTA4ODQ1MTk%3D%40freelog-prod-public.mongodb.rds.aliyuncs.com%3A3717%2Cfreelog-prod-public-secondary.mongodb.rds.aliyuncs.com%3A3717%2Fprod-users%3FreplicaSet%3Dmgset-58730021')
    // };
    config.domain = '127.0.0.1';
    config.localIdentity = {
        userId: 50017,
        username: 'yuliang',
        email: 'support@freelog.com'
    };
    config.kafka = {
        enable: false,
        clientId: 'freelog-identity-service',
        logLevel: 1,
        brokers: ['kafka-0.production:9092', 'kafka-1.production:9092', 'kafka-2.production:9092'],
        connectionTimeout: 3000
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmxvY2FsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcubG9jYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxXQUFXLEdBQUc7SUFDdkIsU0FBUyxFQUFFO1FBQ1AsS0FBSztRQUNMLFlBQVk7UUFDWixLQUFLO1FBQ0wsU0FBUztRQUNULFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLFVBQVU7UUFDVixjQUFjO0tBQ2pCO0lBQ0QsZUFBZSxFQUFFLElBQUk7Q0FDeEIsQ0FBQztBQUVGLGtCQUFlLEdBQUcsRUFBRTtJQUNoQixNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7SUFFdkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLHNCQUFzQixFQUFFLDRCQUE0QixFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFFdkc7O09BRUc7SUFDSCxNQUFNLENBQUMsUUFBUSxHQUFHO1FBQ2QsR0FBRyxFQUFFLGdDQUFnQztLQUN4QyxDQUFDO0lBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyx3UEFBd1AsQ0FBQztLQUNwUixDQUFDO0lBRUYsc0JBQXNCO0lBQ3RCLGdSQUFnUjtJQUNoUixLQUFLO0lBRUwsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7SUFFNUIsTUFBTSxDQUFDLGFBQWEsR0FBRztRQUNuQixNQUFNLEVBQUUsS0FBSztRQUNiLFFBQVEsRUFBRSxTQUFTO1FBQ25CLEtBQUssRUFBRSxxQkFBcUI7S0FDL0IsQ0FBQztJQUVGLE1BQU0sQ0FBQyxLQUFLLEdBQUc7UUFDWCxNQUFNLEVBQUUsS0FBSztRQUNiLFFBQVEsRUFBRSwwQkFBMEI7UUFDcEMsUUFBUSxFQUFFLENBQUM7UUFDWCxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSx5QkFBeUIsRUFBRSx5QkFBeUIsQ0FBQztRQUMxRixpQkFBaUIsRUFBRSxJQUFJO0tBQzFCLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMifQ==