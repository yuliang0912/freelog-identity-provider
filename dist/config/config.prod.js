"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const config = {};
    config.mongoose = {
        url: decodeURIComponent('mongodb%3A%2F%2Fuser_service%3AQzA4Qzg3QTA3NDRCQTA0NDU1RUQxMjI3MTA4ODQ1MTk%3D%40freelog-prod-private.mongodb.rds.aliyuncs.com%3A3717%2Cfreelog-prod-private-secondary.mongodb.rds.aliyuncs.com%3A3717%2Fprod-users%3FreplicaSet%3Dmgset-58730021')
    };
    config.domain = 'freelog.com';
    config.kafka = {
        enable: false,
        clientId: 'freelog-identity-service',
        logLevel: 1,
        brokers: ['kafka-0.production:9092', 'kafka-1.production:9092', 'kafka-2.production:9092'],
        connectionTimeout: 3000,
        retry: {
            initialRetryTime: 5000,
            retries: 20
        }
    };
    config.forum = 'https://forum.freelog.com';
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5wcm9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0JBQWUsR0FBRyxFQUFFO0lBQ2hCLE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUV2QixNQUFNLENBQUMsUUFBUSxHQUFHO1FBQ2QsR0FBRyxFQUFFLGtCQUFrQixDQUFDLGtQQUFrUCxDQUFDO0tBQzlRLENBQUM7SUFFRixNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztJQUU5QixNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ1gsTUFBTSxFQUFFLEtBQUs7UUFDYixRQUFRLEVBQUUsMEJBQTBCO1FBQ3BDLFFBQVEsRUFBRSxDQUFDO1FBQ1gsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUseUJBQXlCLEVBQUUseUJBQXlCLENBQUM7UUFDMUYsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixLQUFLLEVBQUU7WUFDSCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ2Q7S0FDSixDQUFDO0lBRUYsTUFBTSxDQUFDLEtBQUssR0FBRywyQkFBMkIsQ0FBQztJQUUzQyxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMifQ==