import {UserDetailInfo} from "../../interface";
import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'

@provide()
@scope('Singleton')
export default class UserDetailProvider extends MongodbOperation<UserDetailInfo> {

    constructor(@inject('model.userDetailInfo') model) {
        super(model);
    }
}
