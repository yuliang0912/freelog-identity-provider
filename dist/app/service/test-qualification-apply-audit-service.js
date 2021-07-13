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
exports.TestQualificationApplyAuditService = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const send_sms_helper_1 = require("../../extend/send-sms-helper");
const send_mail_helper_1 = require("../../extend/send-mail-helper");
const enum_1 = require("../../enum");
let TestQualificationApplyAuditService = class TestQualificationApplyAuditService {
    ctx;
    userService;
    sendSmsHelper;
    sendMailHelper;
    testQualificationApplyAuditProvider;
    /**
     * 删除测试资格申请记录
     * @param userId
     */
    async deleteTestQualificationApplyRecord(userId) {
        return this.testQualificationApplyAuditProvider.deleteMany({ userId });
    }
    /**
     * 分页查找申请记录
     * @param condition
     * @param options
     */
    async findIntervalList(condition, options) {
        return this.testQualificationApplyAuditProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
    /**
     * 分页查找申请记录
     * @param condition
     * @param status
     * @param options
     */
    async findSearchIntervalList(condition, status, options) {
        const pipeline = [
            {
                $lookup: {
                    from: 'user-infos',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'userInfos'
                }
            }
        ];
        if (status !== undefined) {
            pipeline.unshift({ $match: { status } });
        }
        for (const [key, value] of Object.entries(condition)) {
            pipeline.push({ $match: { [`userInfos.${key}`]: value } });
        }
        const [totalItemInfo] = await this.testQualificationApplyAuditProvider.aggregate([...pipeline, ...[{ $count: 'totalItem' }]]);
        const { totalItem = 0 } = totalItemInfo ?? {};
        pipeline.push({ $sort: options?.sort ?? { userId: -1 } }, { $skip: options?.skip ?? 0 }, { $limit: options?.limit ?? 10 });
        const dataList = await this.testQualificationApplyAuditProvider.aggregate(pipeline);
        return {
            skip: options?.skip ?? 0, limit: options?.limit ?? 10, totalItem, dataList
        };
    }
    /**
     * 查找一条数据
     * @param condition
     */
    async findOne(condition) {
        return this.testQualificationApplyAuditProvider.findOne(condition);
    }
    /**
     * 查找多条数据
     * @param condition
     */
    async find(condition) {
        return this.testQualificationApplyAuditProvider.find(condition);
    }
    /**
     * 申请测试资格
     * @param applyInfo
     */
    async testQualificationApply(applyInfo) {
        const userApplyRecord = await this.testQualificationApplyAuditProvider.findOne({
            userId: this.ctx.userId, status: enum_1.AuditStatusEnum.WaitReview
        });
        if (userApplyRecord) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-apply-existing-error'));
        }
        applyInfo.userId = this.ctx.userId;
        applyInfo.status = enum_1.AuditStatusEnum.WaitReview;
        return this.testQualificationApplyAuditProvider.create(applyInfo);
    }
    /**
     * 修改测试资格申请
     * @param applyInfo
     * @param handleInfo
     */
    async updateTestQualificationApply(applyInfo, handleInfo) {
        return this.testQualificationApplyAuditProvider.updateOne({ _id: applyInfo.id }, {
            operationUserId: this.ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg
        });
    }
    /**
     * 审核申请信息
     * @param ApplyRecordInfo
     * @param handleInfo
     * @returns {Promise<Boolean>}
     */
    async auditTestQualificationApply(applyRecordInfo, handleInfo) {
        const { ctx } = this;
        const userInfo = await this.userService.findOne({ userId: applyRecordInfo.userId });
        if ((userInfo.userType & 1) === 1) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'));
        }
        const task1 = this.testQualificationApplyAuditProvider.updateOne({ _id: applyRecordInfo.id }, {
            operationUserId: ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg
        });
        let task2 = undefined;
        if (handleInfo.status === 1) {
            task2 = this.userService.updateOne({ userId: userInfo.userId }, { userType: userInfo.userType | 1 });
        }
        await Promise.all([task1, task2]).then(() => {
            return this.sendAuditNoticeMessage(userInfo, handleInfo.status);
        });
        return true;
    }
    /**
     * 批量审核
     * @param applyRecordList
     * @param handleInfo
     */
    async batchAuditTestQualificationApply(applyRecordList, handleInfo) {
        const task1 = this.testQualificationApplyAuditProvider.updateMany({ _id: { $in: applyRecordList.map(x => x['_id']) } }, {
            operationUserId: this.ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg
        });
        let task2 = undefined;
        if (handleInfo.status === enum_1.AuditStatusEnum.AuditPass) {
            task2 = this.userService.updateMany({ userId: { $in: applyRecordList.map(x => x.userId) } }, { userType: 1 });
        }
        await Promise.all([task1, task2]);
        this.userService.find({ userId: { $in: applyRecordList.map(x => x.userId) } }).then(userList => {
            userList.forEach(userInfo => this.sendAuditNoticeMessage(userInfo, handleInfo.status));
        });
        return true;
    }
    /**
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    async sendAuditNoticeMessage(userInfo, auditStatus) {
        const { mobile, username, email } = userInfo;
        const templateCodeType = auditStatus === 1 ? 'auditPass' : 'auditFail';
        if (mobile) {
            return this.sendSmsHelper.sendSMS(mobile, this.sendSmsHelper.getTemplate(templateCodeType), {
                username,
                phone: mobile.substr(mobile.length - 4),
                path: auditStatus === 1 ? '' : 'alpha-test/apply'
            });
        }
        else if (email) {
            return this.sendMailHelper.sendMail(email, this.sendMailHelper.getTemplate(templateCodeType, userInfo.username));
        }
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], TestQualificationApplyAuditService.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], TestQualificationApplyAuditService.prototype, "userService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", send_sms_helper_1.default)
], TestQualificationApplyAuditService.prototype, "sendSmsHelper", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", send_mail_helper_1.default)
], TestQualificationApplyAuditService.prototype, "sendMailHelper", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], TestQualificationApplyAuditService.prototype, "testQualificationApplyAuditProvider", void 0);
TestQualificationApplyAuditService = __decorate([
    midway_1.provide()
], TestQualificationApplyAuditService);
exports.TestQualificationApplyAuditService = TestQualificationApplyAuditService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvdGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBU3ZDLHVEQUFnRztBQUNoRyxrRUFBeUQ7QUFDekQsb0VBQTJEO0FBQzNELHFDQUEyQztBQUczQyxJQUFhLGtDQUFrQyxHQUEvQyxNQUFhLGtDQUFrQztJQUczQyxHQUFHLENBQWlCO0lBRXBCLFdBQVcsQ0FBZTtJQUUxQixhQUFhLENBQWdCO0lBRTdCLGNBQWMsQ0FBaUI7SUFFL0IsbUNBQW1DLENBQTBEO0lBRTdGOzs7T0FHRztJQUNILEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxNQUFjO1FBQ25ELE9BQU8sSUFBSSxDQUFDLG1DQUFtQyxDQUFDLFVBQVUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxPQUErQjtRQUNyRSxPQUFPLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25KLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxTQUE0QixFQUFFLE1BQWUsRUFBRSxPQUErQjtRQUV2RyxNQUFNLFFBQVEsR0FBUTtZQUNsQjtnQkFDSSxPQUFPLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixZQUFZLEVBQUUsUUFBUTtvQkFDdEIsRUFB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