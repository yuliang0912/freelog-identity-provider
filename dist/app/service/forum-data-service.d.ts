import { MongodbOperation } from 'egg-freelog-base';
import { UserInfo } from '../../interface';
import { OutsideApiService } from './outside-api-service';
export declare class ForumDataService {
    forum: string;
    userInfoProvider: MongodbOperation<UserInfo>;
    outsideApiService: OutsideApiService;
    /**
     * 同步所有的用户到论坛
     */
    registerAllUserToForum(): Promise<void>;
}
