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
let UserService = class UserService {
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
        userInfo.salt = uuid_1.v4().replace(/-/g, '');
        userInfo.password = common_helper_1.generatePassword(userInfo.salt, userInfo.password);
        userInfo.tokenSn = uuid_1.v4().replace(/-/g, '');
        return this.userInfoProvider.create(userInfo);
    }
    async updateOne(condition, model) {
        return this.userInfoProvider.updateOne(condition, model).then(t => Boolean(t.ok));
    }
    /**
     * 重置密码
     * @param userInfo
     * @param newPassword
     */
    async resetPassword(userInfo, newPassword) {
        const salt = uuid_1.v4().replace(/-/g, '');
        const tokenSn = uuid_1.v4().replace(/-/g, '');
        const password = common_helper_1.generatePassword(salt, newPassword);
        return this.updateOne({ userId: userInfo.userId }, { salt, password, tokenSn });
    }
    /**
     * 更新密码
     * @param userInfo
     * @param oldPassword
     * @param newPassword
     */
    async updatePassword(userInfo, oldPassword, newPassword) {
        if (common_helper_1.generatePassword(userInfo.salt, oldPassword) !== userInfo.password) {
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
     * @param tagId
     * @param options
     */
    async searchIntervalListByTag(condition, tagId, options) {
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
        if (tagId) {
            pipeline.push({ $match: { 'userDetails.tagIds': tagId } });
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
     * @param tagInfo
     */
    async setTag(userId, tagInfo) {
        const userDetail = await this.userDetailProvider.findOne({ userId });
        if (userDetail?.tagIds?.includes(tagInfo.tagId)) {
            return true;
        }
        if (!userDetail) {
            await this.userDetailProvider.create({ userId, tagIds: [tagInfo.tagId] });
        }
        else {
            await this.userDetailProvider.updateOne({ userId }, {
                $addToSet: { tagIds: [tagInfo.tagId] }
            });
        }
        return this.tagService.setTagAutoIncrementCount(tagInfo, 1);
    }
    /**
     * 取消设置Tag
     * @param userId
     * @param tagInfo
     */
    async unsetTag(userId, tagInfo) {
        const userDetail = await this.userDetailProvider.findOne({ userId });
        if (!userDetail || !userDetail.tagIds.includes(tagInfo.tagId)) {
            return true;
        }
        await this.userDetailProvider.updateOne({ userId }, {
            tagIds: userDetail.tagIds.filter(x => x !== tagInfo.tagId)
        });
        return this.tagService.setTagAutoIncrementCount(tagInfo, -1);
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserService.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserService.prototype, "tagService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], UserService.prototype, "userInfoProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], UserService.prototype, "userDetailProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", auto_increment_record_provider_1.default)
], UserService.prototype, "autoIncrementRecordProvider", void 0);
UserService = __decorate([
    midway_1.provide()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL3VzZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBd0I7QUFDeEIsbUNBQXVDO0FBQ3ZDLDhEQUE0RDtBQUM1RCxvR0FBMEY7QUFDMUYsdURBQTZGO0FBSTdGLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7SUFhcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFpQjtRQUN6QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBaUIsRUFBRSxPQUErQjtRQUN6RCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFpQixFQUFFLE9BQStCO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEksQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBaUIsRUFBRSxPQUErQjtRQUM1RCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDakYsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBMkI7UUFDcEMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQywyQkFBMkIsQ0FB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