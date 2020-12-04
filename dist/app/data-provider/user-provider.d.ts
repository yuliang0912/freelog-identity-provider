import { UserInfo } from "../../interface";
import { MongodbOperation } from 'egg-freelog-base';
export default class UserInfoProvider extends MongodbOperation<UserInfo> {
    constructor(model: any);
}
