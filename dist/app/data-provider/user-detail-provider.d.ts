import { UserDetailInfo } from "../../interface";
import { MongodbOperation } from 'egg-freelog-base';
export default class UserDetailProvider extends MongodbOperation<UserDetailInfo> {
    constructor(model: any);
}
