import {v4} from 'uuid';
import {inject, provide} from "midway";
import {generatePassword} from "../../extend/common-helper";
import AutoIncrementRecordProvider from "../data-provider/auto-increment-record-provider";
import {ArgumentError, FreelogContext, MongodbOperation, PageResult} from "egg-freelog-base";
import {findOptions, ITageService, IUserService, TagInfo, UserDetailInfo, UserInfo} from "../../interface";
import {UserRoleEnum, UserStatusEnum} from "../../enum";

@provide()
export class UserService implements IUserService {

    @inject()
    ctx: FreelogContext;
    @inject()
    tagService: ITageService;
    @inject()
    userInfoProvider: MongodbOperation<UserInfo>;
    @inject()
    userDetailProvider: MongodbOperation<UserDetailInfo>;
    @inject()
    autoIncrementRecordProvider: AutoIncrementRecordProvider;

    async count(condition: object): Promise<number> {
        return this.userInfoProvider.count(condition);
    }

    async find(condition: object, options?: findOptions<UserInfo>): Promise<UserInfo[]> {
        return this.userInfoProvider.find(condition, options?.projection, options);
    }

    async findIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>> {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }

    async findOne(condition: object, options?: findOptions<UserInfo>): Promise<UserInfo> {
        return this.userInfoProvider.findOne(condition, options?.projection, options)
    }

    async create(userInfo: Partial<UserInfo>): Promise<UserInfo> {

        userInfo.userId = await this.autoIncrementRecordProvider.getNextUserId();
        userInfo.salt = v4().replace(/-/g, '');
        userInfo.password = generatePassword(userInfo.salt, userInfo.password);
        userInfo.tokenSn = v4().replace(/-/g, '');
        userInfo.status = UserStatusEnum.Normal;
        userInfo.userRole = UserRoleEnum.Customer;

        return this.userInfoProvider.create(userInfo);
    }

    async updateOne(condition: object, model: Partial<UserInfo>): Promise<boolean> {
        return this.userInfoProvider.updateOne(condition, model).then(t => Boolean(t.ok));
    }

    async updateMany(condition: object, model: Partial<UserInfo>): Promise<boolean> {
        return this.userInfoProvider.updateMany(condition, model).then(t => Boolean(t.ok));
    }

    /**
     * 重置密码
     * @param userInfo
     * @param newPassword
     */
    async resetPassword(userInfo: UserInfo, newPassword: string): Promise<boolean> {
        const salt = v4().replace(/-/g, '');
        const tokenSn = v4().replace(/-/g, '');
        const password = generatePassword(salt, newPassword);
        return this.updateOne({userId: userInfo.userId}, {salt, password, tokenSn});
    }

    /**
     * 更新密码
     * @param userInfo
     * @param oldPassword
     * @param newPassword
     */
    async updatePassword(userInfo: UserInfo, oldPassword: string, newPassword: string): Promise<boolean> {
        if (generatePassword(userInfo.salt, oldPassword) !== userInfo.password) {
            throw new ArgumentError(this.ctx.gettext('login-password-validate-failed'));
        }
        if (oldPassword === newPassword) {
            return true;
        }
        return this.resetPassword(userInfo, newPassword);
    }

    /**
     * 搜索
     * @param condition
     * @param tagId
     * @param options
     */
    async searchIntervalListByTags(condition: object, tagIds?: number[], options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>> {

        const pipeline: any = [
            {
                $lookup: {
                    from: 'user-detail-infos',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'userDetails'
                }
            }
        ];
        if (Array.isArray(tagIds) && tagIds.length) {
            pipeline.push({$match: {'userDetails.tagIds': {$in: tagIds}}});
        }
        if (Object.keys(condition).length) {
            pipeline.unshift({$match: condition});
        }
        const [totalItemInfo] = await this.userInfoProvider.aggregate([...pipeline, ...[{$count: 'totalItem'}]])
        const {totalItem = 0} = totalItemInfo ?? {};

        pipeline.push({$sort: options?.sort ?? {userId: -1}}, {$skip: options?.skip ?? 0}, {$limit: options?.limit ?? 10});
        const dataList = await this.userInfoProvider.aggregate(pipeline);

        return {
            skip: options?.skip ?? 0, limit: options?.limit ?? 10, totalItem, dataList
        }
    }

    async searchIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>> {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, null, options?.sort ?? {userId: -1})
    }

    /**
     * 设置标签
     * @param userId
     * @param tagInfo
     */
    async setTag(userId: number, tagInfo: TagInfo): Promise<boolean> {
        const userDetail = await this.userDetailProvider.findOne({userId});
        if (userDetail?.tagIds?.includes(tagInfo.tagId)) {
            return true;
        }
        if (!userDetail) {
            await this.userDetailProvider.create({userId, tagIds: [tagInfo.tagId]});
        } else {
            await this.userDetailProvider.updateOne({userId}, {
                $addToSet: {tagIds: [tagInfo.tagId]}
            })
        }
        return this.tagService.setTagAutoIncrementCount(tagInfo, 1);
    }

    /**
     * 取消设置Tag
     * @param userId
     * @param tagInfo
     */
    async unsetTag(userId: number, tagInfo: TagInfo): Promise<boolean> {
        const userDetail = await this.userDetailProvider.findOne({userId});
        if (!userDetail || !userDetail.tagIds.includes(tagInfo.tagId)) {
            return true;
        }
        await this.userDetailProvider.updateOne({userId}, {
            tagIds: userDetail.tagIds.filter(x => x !== tagInfo.tagId)
        })
        return this.tagService.setTagAutoIncrementCount(tagInfo, -1);
    }

    /**
     * 更新用户详情信息
     * @param condition
     * @param model
     */
    async updateOneUserDetail(condition: object, model: Partial<UserDetailInfo>): Promise<boolean> {
        return this.userDetailProvider.updateOne(condition, model).then(t => Boolean(t.ok));
    }

    async findUserDetails(condition: object): Promise<UserDetailInfo[]> {
        return this.userDetailProvider.find(condition);
    }
}
