export default () => {
    const config: any = {};

    config.cluster = {
        listen: {port: 5111}
    };

    config.mongoose = {
        url: 'mongodb://mongo-test.common:27017/user'
    };

    return config;
};
