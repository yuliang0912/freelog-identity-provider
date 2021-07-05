"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const config = {};
    config.cluster = {
        listen: { port: 5111 }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0JBQWUsR0FBRyxFQUFFO0lBQ2hCLE1BQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUV2QixNQUFNLENBQUMsT0FBTyxHQUFHO1FBQ2IsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQztLQUN2QixDQUFDO0lBRUYsc0JBQXNCO0lBQ3RCLG9EQUFvRDtJQUNwRCxLQUFLO0lBRUwsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLEdBQUcsRUFBRSxrTkFBa047S0FDMU4sQ0FBQztJQUVGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUM7SUFFbEMsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFDIn0=