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
        url: "mongodb://localhost:27017/user",
    }

    config.localIdentity = {
        userId: 50003,
        username: 'yuliang',
        email: 'support@freelog.com'
    };

    return config;
};
