import AutoIncrementRecordProvider from "../data-provider/auto-increment-record-provider";
import { FreelogContext, MongodbOperation, PageResult } from "egg-freelog-base";
import { findOptions, ITageService, IUserService, TagInfo, UserDetailInfo, UserInfo } from "../../interface";
export declare class UserService implements IUserService {
    ctx: FreelogContext;
    tagService: ITageService;
    userInfoProvider: MongodbOperation<UserInfo>;
    userDetailProvider: MongodbOperation<UserDetailInfo>;
    autoIncrementRecordProvider: AutoIncrementRecordProvider;
    count(condition: object): Promise<number>;
    find(condition: object, options?: findOptions<UserInfo>): Promise<UserInfo[]>;
    findIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
    findOne(condition: object, options?: findOptions<UserInfo>): Promise<UserInfo>;
    create(userInfo: Partial<UserInfo>): Promise<UserInfo>;
    updateOne(condition: object, model: Partial<UserInfo>): Promise<boolean>;
    /**
     * 重置密码
     * @param userInfo
     * @param newPassword
     */
    resetPassword(userInfo: UserInfo, newPassword: string): Promise<boolean>;
    /**
     * 更新密码
     * @param userInfo
     * @param oldPassword
     * @param newPassword
     */
    updatePassword(userInfo: UserInfo, oldPassword: string, newPassword: string): Promise<boolean>;
    /**
     * 搜索
     * @param condition
     * @param tagId
     * @param options
     */
    searchIntervalListByTag(condition: object, tagId?: number, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
    searchIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
    /**
     * 设置标签
     * @param userId
     * @param tagInfo
     */
    setTag(userId: number, tagInfo: TagInfo): Promise<boolean>;
    /**
     * 取消设置Tag
     * @param userId
     * @param tagInfo
     */
    unsetTag(userId: number, tagInfo: TagInfo): Promise<boolean>;
}
