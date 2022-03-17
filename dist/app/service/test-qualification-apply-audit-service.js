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
const freelog_common_func_1 = require("egg-freelog-base/lib/freelog-common-func");
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
     * @param applyRecordInfo
     * @param handleInfo
     * @returns {Promise<Boolean>}
     */
    async auditTestQualificationApply(applyRecordInfo, handleInfo) {
        const { ctx } = this;
        const userInfo = await this.userService.findOne({ userId: applyRecordInfo.userId });
        if ((userInfo.userType & 1) === 1) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'));
        }
        const task1 = this.testQualificationApplyAuditProvider.updateOne({ _id: applyRecordInfo.id }, (0, freelog_common_func_1.deleteUndefinedFields)({
            operationUserId: ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg,
            remark: handleInfo.remark
        }));
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
        const task1 = this.testQualificationApplyAuditProvider.updateMany({ _id: { $in: applyRecordList.map(x => x['_id']) } }, (0, freelog_common_func_1.deleteUndefinedFields)({
            operationUserId: this.ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg,
            remark: handleInfo.remark
        }));
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
        const templateCodeType = auditStatus === 1 ? enum_1.AuthCodeTypeEnum.AuditPass : enum_1.AuthCodeTypeEnum.AuditFail;
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
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], TestQualificationApplyAuditService.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], TestQualificationApplyAuditService.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", send_sms_helper_1.default)
], TestQualificationApplyAuditService.prototype, "sendSmsHelper", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", send_mail_helper_1.default)
], TestQualificationApplyAuditService.prototype, "sendMailHelper", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], TestQualificationApplyAuditService.prototype, "testQualificationApplyAuditProvider", void 0);
TestQualificationApplyAuditService = __decorate([
    (0, midway_1.provide)()
], TestQualificationApplyAuditService);
exports.TestQualificationApplyAuditService = TestQualificationApplyAuditService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvdGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBU3ZDLHVEQUFnRztBQUNoRyxrRUFBeUQ7QUFDekQsb0VBQTJEO0FBQzNELHFDQUE2RDtBQUM3RCxrRkFBK0U7QUFHL0UsSUFBYSxrQ0FBa0MsR0FBL0MsTUFBYSxrQ0FBa0M7SUFHM0MsR0FBRyxDQUFpQjtJQUVwQixXQUFXLENBQWU7SUFFMUIsYUFBYSxDQUFnQjtJQUU3QixjQUFjLENBQWlCO0lBRS9CLG1DQUFtQyxDQUEwRDtJQUU3Rjs7O09BR0c7SUFDSCxLQUFLLENBQUMsa0NBQWtDLENBQUMsTUFBYztRQUNuRCxPQUFPLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxVQUFVLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQWlCLEVBQUUsT0FBK0I7UUFDckUsT0FBTyxJQUFJLENBQUMsbUNBQW1DLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuSixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsc0JBQXNCLENBQUMsU0FBNEIsRUFBRSxNQUFlLEVBQUUsT0FBK0I7UUFFdkcsTUFBTSxRQUFRLEdBQVE7WUFDbEI7Z0JBQ0ksT0FBTyxFQUFFO29CQUNMLElBQUksRUFBRSxZQUFZO29CQUNsQixVQUFVLEVBQUUsUUFBUTtvQkFDcEIsWUFBWSxFQUFFLFFB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