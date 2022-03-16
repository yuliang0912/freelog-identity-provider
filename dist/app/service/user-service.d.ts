import AutoIncrementRecordProvider from '../data-provider/auto-increment-record-provider';
import { FreelogContext, MongodbOperation, PageResult } from 'egg-freelog-base';
import { findOptions, ITageService, IUserService, TagInfo, UserDetailInfo, UserInfo } from '../../interface';
export declare class UserService implements IUserService {
    ctx: FreelogContext;
    tagService: ITageService;
    userInfoProvider: MongodbOperation<UserInfo>;
    userDetailProvider: MongodbOperation<UserDetailInfo>;
    autoIncrementRecordProvider: AutoIncrementRecordProvider;
    findUserByLoginName(loginName: string): Promise<UserInfo>;
    count(condition: object): Promise<number>;
    find(condition: object, options?: findOptions<UserInfo>): Promise<UserInfo[]>;
    findIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
    findOne(condition: object, options?: findOptions<UserInfo>): Promise<UserInfo>;
    create(userInfo: Partial<UserInfo>): Promise<UserInfo>;
    updateOne(condition: object, model: Partial<UserInfo>): Promise<boolean>;
    updateMany(condition: object, model: Partial<UserInfo>): Promise<boolean>;
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
     * @param tagIds
     * @param options
     */
    searchIntervalListByTags(condition: object, tagIds?: number[], options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
    searchIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
    /**
     * 设置标签
     * @param userId
     * @param tagInfos
     */
    setTag(userId: number, tagInfos: TagInfo[]): Promise<boolean>;
    /**
     * 批量为多用户设置标签
     * @param userIds
     * @param tagInfo
     */
    batchSetTag(userIds: number[], tagInfos: TagInfo[]): Promise<boolean>;
    /**
     * 取消设置Tag
     * @param userId
     * @param tagInfos
     */
    unsetTag(userId: number, tagInfos: TagInfo[]): Promise<boolean>;
    /**
     * 更新用户详情信息
     * @param condition
     * @param model
     */
    updateOneUserDetail(condition: object, model: Partial<UserDetailInfo>): Promise<boolean>;
    findUserDetails(condition: object): Promise<UserDetailInfo[]>;
}
