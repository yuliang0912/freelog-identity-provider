export default () => {
    const config: any = {};

    config.cluster = {
        listen: {port: 5111}
    };

    // config.mongoose = {
    //     url: 'mongodb://mongo-test.common:27017/user'
    // };

    config.mongoose = {
        url: `mongodb://user_service:QzA4Qzg3QTA3NDRCQTA0NDU1RUQxMjI3MTA4ODQ1MTk=@dds-wz9ac40fee5c09441.mongodb.rds.aliyuncs.com:3717,dds-wz9ac40fee5c09442.mongodb.rds.aliyuncs.com:3717/test-users?replicaSet=mgset-44484047`
    };

    config.domain = 'testfreelog.com';

    return config;
};
