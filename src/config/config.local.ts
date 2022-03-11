export const development = {
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

export default () => {
    const config: any = {};

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
        userId: 50003,
        username: 'yuliang',
        email: 'support@freelog.com'
    };

    return config;
};
