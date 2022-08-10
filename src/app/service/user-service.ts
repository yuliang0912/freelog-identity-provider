import {v4} from 'uuid';
import {config, inject, provide} from 'midway';
import {generatePassword} from '../../extend/common-helper';
import AutoIncrementRecordProvider from '../data-provider/auto-increment-record-provider';
import {ArgumentError, CommonRegex, FreelogContext, MongodbOperation, PageResult} from 'egg-freelog-base';
import {
    findOptions,
    ITageService,
    IUserService,
    TagInfo,
    UserDetailInfo,
    UserInfo
} from '../../interface';
import {UserRoleEnum, UserStatusEnum} from '../../enum';
import {difference, intersection} from 'lodash';
import {OutsideApiService} from './outside-api-service';
import {KafkaClient} from '../../kafka/client';
import {RsaHelper} from '../../extend/rsa-helper';

@provide()
export class UserService implements IUserService {

    @config()
    jwtAuth;
    @inject()
    kafkaClient: KafkaClient;
    @inject()
    rsaHelper: RsaHelper;
    @inject()
    ctx: FreelogContext;
    @inject()
    tagService: ITageService;
    @inject()
    userInfoProvider: MongodbOperation<UserInfo>;
    @inject()
    userDetailProvider: MongodbOperation<UserDetailInfo>;
    @inject()
    outsideApiService: OutsideApiService;
    @inject()
    autoIncrementRecordProvider: AutoIncrementRecordProvider;

    // 通过登录名查找用户(忽略大小写)
    async findUserByLoginName(loginName: string): Promise<UserInfo> {
        const condition: any = {};
        const loginNameRegex = new RegExp(`^${loginName}$`, 'i');
        if (CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginNameRegex;
        } else if (CommonRegex.email.test(loginName)) {
            condition.email = loginNameRegex;
        } else if (CommonRegex.username.test(loginName)) {
            condition.username = loginNameRegex;
        } else {
            throw new ArgumentError('参数错误');
        }
        return this.userInfoProvider.findOne(condition);
    }

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
        return this.userInfoProvider.findOne(condition, options?.projection, options);
    }

    async create(userInfo: Partial<UserInfo>): Promise<UserInfo> {

        userInfo.userId = await this.autoIncrementRecordProvider.getNextUserId();
        userInfo.salt = v4().replace(/-/g, '');
        userInfo.password = generatePassword(userInfo.salt, userInfo.password);
        userInfo.tokenSn = v4().replace(/-/g, '');
        userInfo.status = UserStatusEnum.Normal;
        userInfo.userRole = UserRoleEnum.Customer;

        const user = await this.userInfoProvider.create(userInfo);
        if (userInfo) {
            // const ras = this.rsaHelper.build(this.jwtAuth.publicKey, this.jwtAuth.privateKey);
            // const eventBody: IUserRegisterEventBody = {
            //     userId: user.userId,
            //     username: user.username,
            //     email: user.email,
            //     mobile: user.mobile,
            //     password: ras.privateKeyEncrypt(userInfo.password)
            // };
            // this.kafkaClient.send({
            //     topic: 'user-register-event-topic',
            //     messages: [{
            //         value: JSON.stringify(eventBody)
            //     }]
            // }).catch(e => console.error(`kafka用户注册消息发送失败,userId:${user.userId}`));
        }
        return user;
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
        await this.updateOne({userId: userInfo.userId}, {salt, password, tokenSn});
        // const ras = this.rsaHelper.build(this.jwtAuth.publicKey, this.jwtAuth.privateKey);
        // const eventBody: IUserChangePasswordEventBody = {
        //     userId: userInfo.userId,
        //     username: userInfo.username,
        //     password: ras.privateKeyEncrypt(newPassword)
        // };
        // this.kafkaClient.send({
        //     topic: 'user-change-password-event-topic',
        //     messages: [{
        //         value: JSON.stringify(eventBody)
        //     }]
        // }).catch(e => console.error(`kafka用户更新密码事件发送失败,userId:${userInfo.userId},password:${newPassword}`));
        return true;
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
     * @param tagIds
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
        const [totalItemInfo] = await this.userInfoProvider.aggregate([...pipeline, ...[{$count: 'totalItem'}]]);
        const {totalItem = 0} = totalItemInfo ?? {};

        pipeline.push({$sort: options?.sort ?? {userId: -1}}, {$skip: options?.skip ?? 0}, {$limit: options?.limit ?? 10});
        const dataList = await this.userInfoProvider.aggregate(pipeline);

        return {
            skip: options?.skip ?? 0, limit: options?.limit ?? 10, totalItem, dataList
        };
    }

    /**
     * 搜索
     * @param condition
     * @param options
     */
    async searchIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>> {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, null, options?.sort ?? {userId: -1});
    }

    /**
     * 设置标签
     * @param userId
     * @param tagInfos
     */
    async setTag(userId: number, tagInfos: TagInfo[]): Promise<boolean> {

        const tagIds = tagInfos.map(x => x.tagId);
        const userDetail = await this.userDetailProvider.findOne({userId});
        if (!userDetail) {
            await this.userDetailProvider.create({userId, tagIds});
        } else {
            await this.userDetailProvider.updateOne({userId}, {
                $addToSet: {tagIds}
            });
        }

        const effectiveTagIds = difference(tagIds, userDetail?.tagIds ?? []);

        return this.tagService.setTagAutoIncrementCounts(effectiveTagIds, 1);
    }

    /**
     * 批量为多用户设置标签
     * @param userIds
     * @param tagInfos
     */
    async batchSetTag(userIds: number[], tagInfos: TagInfo[]): Promise<boolean> {
        const userDetailList = await this.userDetailProvider.find({userId: {$in: userIds}});
        const effectiveTag = new Map<number, number>();
        for (const tagInfo of tagInfos) {
            for (const user of userDetailList) {
                if (!user.tagIds?.includes(tagInfo.tagId)) {
                    effectiveTag.set(tagInfo.tagId, (effectiveTag.get(tagInfo.tagId) ?? 0) + 1);
                }
            }
        }
        await this.userDetailProvider.updateMany({userId: {$in: userIds}}, {
            $addToSet: {tagIds: tagInfos.map(x => x.tagId)}
        });

        for (const [key, value] of effectiveTag) {
            const tagInfo = tagInfos.find(x => x.tagId === key);
            this.tagService.setTagAutoIncrementCount(tagInfo, value).then();
        }
        return true;
    }

    /**
     * 取消设置Tag
     * @param userId
     * @param tagInfos
     */
    async unsetTag(userId: number, tagInfos: TagInfo[]): Promise<boolean> {
        const tagIds = tagInfos.map(x => x.tagId);
        const userDetail = await this.userDetailProvider.findOne({userId});
        const effectiveTagIds = intersection(tagIds, userDetail?.tagIds ?? []);
        if (!effectiveTagIds.length) {
            return true;
        }
        const userTagIds = difference(userDetail?.tagIds ?? [], tagIds);

        await this.userDetailProvider.updateOne({userId}, {
            tagIds: userTagIds
        });
        return this.tagService.setTagAutoIncrementCounts(effectiveTagIds, -1);
    }

    /**
     * 更新用户详情信息
     * @param condition
     * @param model
     */
    async updateOneUserDetail(condition: object, model: Partial<UserDetailInfo>): Promise<boolean> {
        await this.userDetailProvider.findOneAndUpdate(condition, model, {new: true}).then(data => {
            return data || this.userDetailProvider.create(Object.assign(condition, model));
        });
        this.outsideApiService.sendActivityEvent('TS000012', condition['userId']).catch(console.error);
        return true;
    }

    /**
     * 查找用户详情数据
     * @param condition
     */
    async findUserDetails(condition: object): Promise<UserDetailInfo[]> {
        return this.userDetailProvider.find(condition);
    }
}
