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
let UserService = class UserService {
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
        return this.userInfoProvider.create(userInfo);
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
        return this.updateOne({ userId: userInfo.userId }, { salt, password, tokenSn });
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
     * @param tagInfo
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
    async findUserDetails(condition) {
        return this.userDetailProvider.find(condition);
    }
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL3VzZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBd0I7QUFDeEIsbUNBQXVDO0FBQ3ZDLDhEQUE0RDtBQUM1RCxvR0FBMEY7QUFDMUYsdURBQTBHO0FBRTFHLHFDQUF3RDtBQUN4RCxtQ0FBZ0Q7QUFDaEQsK0RBQXdEO0FBR3hELElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7SUFHcEIsR0FBRyxDQUFpQjtJQUVwQixVQUFVLENBQWU7SUFFekIsZ0JBQWdCLENBQTZCO0lBRTdDLGtCQUFrQixDQUFtQztJQUVyRCxpQkFBaUIsQ0FBb0I7SUFFckMsMkJBQTJCLENBQThCO0lBRXpELG1CQUFtQjtJQUNuQixLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBaUI7UUFDdkMsTUFBTSxTQUFTLEdBQVEsRUFBRSxDQUFDO1FBQzFCLE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksU0FBUyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekQsSUFBSSw4QkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7U0FDckM7YUFBTSxJQUFJLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQyxTQUFTLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztTQUNwQzthQUFNLElBQUksOEJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxNQUFNLElBQUksZ0NBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sSUFBSSxD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