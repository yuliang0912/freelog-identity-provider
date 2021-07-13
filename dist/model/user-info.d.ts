/// <reference types="lodash" />
import { MongooseModelBase } from 'egg-freelog-base/database/mongoose-model-base';
export declare class UserInfoModel extends MongooseModelBase {
    constructor(mongoose: any);
    buildMongooseModel(): any;
    static get toObjectOptions(): {
        transform: (doc: any, ret: any, options: any) => import("lodash").Omit<any, "password" | "salt" | "userRole" | "_id" | "updateDate" | "userDetails">;
    };
}
