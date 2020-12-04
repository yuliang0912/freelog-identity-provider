import {UserInfo} from "../../interface";
import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'


@provide()
@scope('Singleton')
export default class UserInfoProvider extends MongodbOperation<UserInfo> {

    constructor(@inject('model.userInfo') model) {
        super(model);
    }
}
