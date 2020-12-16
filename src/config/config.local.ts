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

    // config.mongoose = {
    //     url: "mongodb://39.108.77.211:30772/user",
    // }


    config.domain = "127.0.0.1";

    config.localIdentity = {
        userId: 50003,
        username: 'yuliang',
        email: 'support@freelog.com'
    };

    return config;
};
