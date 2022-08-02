import {config, inject, provide} from 'midway';
import {MongodbOperation} from 'egg-freelog-base';
import {UserInfo} from '../../interface';
import {OutsideApiService} from './outside-api-service';

@provide()
export class ForumDataService {

    @config()
    forum: string;
    @inject()
    userInfoProvider: MongodbOperation<UserInfo>;
    @inject()
    outsideApiService: OutsideApiService;

    /**
     * 同步所有的用户到论坛
     */
    async registerAllUserToForum() {
        const userList = await this.userInfoProvider.find({});
        for (const userInfo of userList) {
            this.outsideApiService.registerUserToForum({
                userId: userInfo.userId,
                username: userInfo.username,
                email: userInfo.email,
                mobile: userInfo.mobile,
                password: '123456' // 历史密码已不知晓,所以默认为123456,用户可以通过修改密码来实现同步
            }).then();
        }
    }
}
