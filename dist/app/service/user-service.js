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
    kafka;
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
            const ras = this.rsaHelper.build(this.jwtAuth.publicKey, this.jwtAuth.privateKey);
            const eventBody = {
                userId: user.userId,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                password: ras.privateKeyEncrypt(userInfo.password)
            };
            this.kafka.send({
                topic: 'user-register-event-topic',
                messages: [{
                        value: JSON.stringify(eventBody)
                    }]
            }).catch(e => console.error(`kafka用户注册消息发送失败,userId:${user.userId}`));
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
        const ras = this.rsaHelper.build(this.jwtAuth.publicKey, this.jwtAuth.privateKey);
        const eventBody = {
            userId: userInfo.userId,
            username: userInfo.username,
            password: ras.privateKeyEncrypt(newPassword)
        };
        this.kafka.send({
            topic: 'user-change-password-event-topic',
            messages: [{
                    value: JSON.stringify(eventBody)
                }]
        }).catch(e => console.error(`kafka用户更新密码事件发送失败,userId:${userInfo.userId},password:${newPassword}`));
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
], UserService.prototype, "kafka", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL3VzZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBd0I7QUFDeEIsbUNBQStDO0FBQy9DLDhEQUE0RDtBQUM1RCxvR0FBMEY7QUFDMUYsdURBQTBHO0FBVTFHLHFDQUF3RDtBQUN4RCxtQ0FBZ0Q7QUFDaEQsK0RBQXdEO0FBQ3hELCtDQUErQztBQUMvQyx3REFBa0Q7QUFHbEQsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztJQUdwQixPQUFPLENBQUM7SUFFUixLQUFLLENBQWM7SUFFbkIsU0FBUyxDQUFZO0lBRXJCLEdBQUcsQ0FBaUI7SUFFcEIsVUFBVSxDQUFlO0lBRXpCLGdCQUFnQixDQUE2QjtJQUU3QyxrQkFBa0IsQ0FBbUM7SUFFckQsaUJBQWlCLENBQW9CO0lBRXJDLDJCQUEyQixDQUE4QjtJQUV6RCxtQkFBbUI7SUFDbkIsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQWlCO1FBQ3ZDLE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztRQUMxQixNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFNBQVMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELElBQUksOEJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDO1NBQ3JDO2FBQU0sSUFBSSw4QkFBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDMUMsU0FBUyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7U0FDcEM7YUFBTSxJQUFJLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QyxTQUFTLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztT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