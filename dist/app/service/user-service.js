"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const uuid_1 = require("uuid");
const midway_1 = require("midway");
const common_helper_1 = require("../../extend/common-helper");
const auto_increment_record_provider_1 = require("../data-provider/auto-increment-record-provider");
const egg_freelog_base_1 = require("egg-freelog-base");
const enum_1 = require("../../enum");
const lodash_1 = require("lodash");
const outside_api_service_1 = require("./outside-api-service");
const client_1 = require("../../kafka/client");
const rsa_helper_1 = require("../../extend/rsa-helper");
let UserService = class UserService {
    jwtAuth;
    kafkaClient;
    rsaHelper;
    ctx;
    tagService;
    userInfoProvider;
    userDetailProvider;
    outsideApiService;
    autoIncrementRecordProvider;
    // 通过登录名查找用户(忽略大小写)
    async findUserByLoginName(loginName) {
        const condition = {};
        const loginNameRegex = new RegExp(`^${loginName}$`, 'i');
        if (egg_freelog_base_1.CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginNameRegex;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(loginName)) {
            condition.email = loginNameRegex;
        }
        else if (egg_freelog_base_1.CommonRegex.username.test(loginName)) {
            condition.username = loginNameRegex;
        }
        else {
            throw new egg_freelog_base_1.ArgumentError('参数错误');
        }
        return this.userInfoProvider.findOne(condition);
    }
    async count(condition) {
        return this.userInfoProvider.count(condition);
    }
    async find(condition, options) {
        return this.userInfoProvider.find(condition, options?.projection, options);
    }
    async findIntervalList(condition, options) {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
    async findOne(condition, options) {
        return this.userInfoProvider.findOne(condition, options?.projection, options);
    }
    async create(userInfo) {
        userInfo.userId = await this.autoIncrementRecordProvider.getNextUserId();
        userInfo.salt = (0, uuid_1.v4)().replace(/-/g, '');
        userInfo.password = (0, common_helper_1.generatePassword)(userInfo.salt, userInfo.password);
        userInfo.tokenSn = (0, uuid_1.v4)().replace(/-/g, '');
        userInfo.status = enum_1.UserStatusEnum.Normal;
        userInfo.userRole = enum_1.UserRoleEnum.Customer;
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
    async updateOne(condition, model) {
        return this.userInfoProvider.updateOne(condition, model).then(t => Boolean(t.ok));
    }
    async updateMany(condition, model) {
        return this.userInfoProvider.updateMany(condition, model).then(t => Boolean(t.ok));
    }
    /**
     * 重置密码
     * @param userInfo
     * @param newPassword
     */
    async resetPassword(userInfo, newPassword) {
        const salt = (0, uuid_1.v4)().replace(/-/g, '');
        const tokenSn = (0, uuid_1.v4)().replace(/-/g, '');
        const password = (0, common_helper_1.generatePassword)(salt, newPassword);
        await this.updateOne({ userId: userInfo.userId }, { salt, password, tokenSn });
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
    async updatePassword(userInfo, oldPassword, newPassword) {
        if ((0, common_helper_1.generatePassword)(userInfo.salt, oldPassword) !== userInfo.password) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('login-password-validate-failed'));
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
    async searchIntervalListByTags(condition, tagIds, options) {
        const pipeline = [
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
            pipeline.push({ $match: { 'userDetails.tagIds': { $in: tagIds } } });
        }
        if (Object.keys(condition).length) {
            pipeline.unshift({ $match: condition });
        }
        const [totalItemInfo] = await this.userInfoProvider.aggregate([...pipeline, ...[{ $count: 'totalItem' }]]);
        const { totalItem = 0 } = totalItemInfo ?? {};
        pipeline.push({ $sort: options?.sort ?? { userId: -1 } }, { $skip: options?.skip ?? 0 }, { $limit: options?.limit ?? 10 });
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
    async searchIntervalList(condition, options) {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, null, options?.sort ?? { userId: -1 });
    }
    /**
     * 设置标签
     * @param userId
     * @param tagInfos
     */
    async setTag(userId, tagInfos) {
        const tagIds = tagInfos.map(x => x.tagId);
        const userDetail = await this.userDetailProvider.findOne({ userId });
        if (!userDetail) {
            await this.userDetailProvider.create({ userId, tagIds });
        }
        else {
            await this.userDetailProvider.updateOne({ userId }, {
                $addToSet: { tagIds }
            });
        }
        const effectiveTagIds = (0, lodash_1.difference)(tagIds, userDetail?.tagIds ?? []);
        return this.tagService.setTagAutoIncrementCounts(effectiveTagIds, 1);
    }
    /**
     * 批量为多用户设置标签
     * @param userIds
     * @param tagInfos
     */
    async batchSetTag(userIds, tagInfos) {
        const userDetailList = await this.userDetailProvider.find({ userId: { $in: userIds } });
        const effectiveTag = new Map();
        for (const tagInfo of tagInfos) {
            for (const user of userDetailList) {
                if (!user.tagIds?.includes(tagInfo.tagId)) {
                    effectiveTag.set(tagInfo.tagId, (effectiveTag.get(tagInfo.tagId) ?? 0) + 1);
                }
            }
        }
        await this.userDetailProvider.updateMany({ userId: { $in: userIds } }, {
            $addToSet: { tagIds: tagInfos.map(x => x.tagId) }
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
    async unsetTag(userId, tagInfos) {
        const tagIds = tagInfos.map(x => x.tagId);
        const userDetail = await this.userDetailProvider.findOne({ userId });
        const effectiveTagIds = (0, lodash_1.intersection)(tagIds, userDetail?.tagIds ?? []);
        if (!effectiveTagIds.length) {
            return true;
        }
        const userTagIds = (0, lodash_1.difference)(userDetail?.tagIds ?? [], tagIds);
        await this.userDetailProvider.updateOne({ userId }, {
            tagIds: userTagIds
        });
        return this.tagService.setTagAutoIncrementCounts(effectiveTagIds, -1);
    }
    /**
     * 更新用户详情信息
     * @param condition
     * @param model
     */
    async updateOneUserDetail(condition, model) {
        await this.userDetailProvider.findOneAndUpdate(condition, model, { new: true }).then(data => {
            return data || this.userDetailProvider.create(Object.assign(condition, model));
        });
        this.outsideApiService.sendActivityEvent('TS000012', condition['userId']).catch(console.error);
        return true;
    }
    /**
     * 查找用户详情数据
     * @param condition
     */
    async findUserDetails(condition) {
        return this.userDetailProvider.find(condition);
    }
};
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], UserService.prototype, "jwtAuth", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", client_1.KafkaClient)
], UserService.prototype, "kafkaClient", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", rsa_helper_1.RsaHelper)
], UserService.prototype, "rsaHelper", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], UserService.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], UserService.prototype, "tagService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], UserService.prototype, "userInfoProvider", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], UserService.prototype, "userDetailProvider", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], UserService.prototype, "outsideApiService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", auto_increment_record_provider_1.default)
], UserService.prototype, "autoIncrementRecordProvider", void 0);
UserService = __decorate([
    (0, midway_1.provide)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL3VzZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBd0I7QUFDeEIsbUNBQStDO0FBQy9DLDhEQUE0RDtBQUM1RCxvR0FBMEY7QUFDMUYsdURBQTBHO0FBUzFHLHFDQUF3RDtBQUN4RCxtQ0FBZ0Q7QUFDaEQsK0RBQXdEO0FBQ3hELCtDQUErQztBQUMvQyx3REFBa0Q7QUFHbEQsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztJQUdwQixPQUFPLENBQUM7SUFFUixXQUFXLENBQWM7SUFFekIsU0FBUyxDQUFZO0lBRXJCLEdBQUcsQ0FBaUI7SUFFcEIsVUFBVSxDQUFlO0lBRXpCLGdCQUFnQixDQUE2QjtJQUU3QyxrQkFBa0IsQ0FBbUM7SUFFckQsaUJBQWlCLENBQW9CO0lBRXJDLDJCQUEyQixDQUE4QjtJQUV6RCxtQkFBbUI7SUFDbkIsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQWlCO1FBQ3ZDLE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztRQUMxQixNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFNBQVMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELElBQUksOEJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDO1NBQ3JDO2FBQU0sSUFBSSw4QkFBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDMUMsU0FBUyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7U0FDcEM7YUFBTSxJQUFJLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QyxTQUFTLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztT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