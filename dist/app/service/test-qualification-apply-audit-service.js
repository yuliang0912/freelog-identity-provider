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
let TestQualificationApplyAuditService = class TestQualificationApplyAuditService {
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
     * 查找一条数据
     * @param condition
     */
    async findOne(condition) {
        return this.testQualificationApplyAuditProvider.findOne(condition);
    }
    /**
     * 申请测试资格
     * @param applyInfo
     */
    async testQualificationApply(applyInfo) {
        const userApplyRecord = await this.testQualificationApplyAuditProvider.findOne({
            userId: this.ctx.userId, status: 0
        });
        if (userApplyRecord) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-apply-existing-error'));
        }
        applyInfo.userId = this.ctx.userId;
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
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    async sendAuditNoticeMessage(userInfo, auditStatus) {
        const { mobile, username, email } = userInfo;
        const templateCodeType = auditStatus === 1 ? "auditPass" : "auditFail";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvdGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBT3ZDLHVEQUFnRztBQUNoRyxrRUFBeUQ7QUFDekQsb0VBQTJEO0FBRzNELElBQWEsa0NBQWtDLEdBQS9DLE1BQWEsa0NBQWtDO0lBYTNDOzs7T0FHRztJQUNILEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxNQUFjO1FBQ25ELE9BQU8sSUFBSSxDQUFDLG1DQUFtQyxDQUFDLFVBQVUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxPQUErQjtRQUNyRSxPQUFPLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25KLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQXlEO1FBQ25FLE9BQU8sSUFBSSxDQUFDLG1DQUFtQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFNBQXlEO1FBRWxGLE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1DQUFtQyxDQUFDLE9BQU8sQ0FBQztZQUMzRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDckMsQ0FB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