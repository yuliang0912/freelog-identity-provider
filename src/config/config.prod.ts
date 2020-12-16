export default () => {
    const config: any = {};

    config.mongoose = {
        url: 'mongodb://mongo-prod.common:27017/user'
    };

    // config.mongoose = {
    //     url: 'mongodb://39.108.77.211:30772/node-beta'
    // };

    config.domain = 'freelog.com'

    return config;
};
