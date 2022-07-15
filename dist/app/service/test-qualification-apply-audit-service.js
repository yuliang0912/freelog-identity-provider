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
     * @param args
     */
    async findOne(condition, ...args) {
        return this.testQualificationApplyAuditProvider.findOne(condition, ...args);
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
            const emailSubject = templateCodeType === enum_1.AuthCodeTypeEnum.AuditPass ? '【Freelog】内测申请通过' : '【Freelog】内测申请未通过';
            return this.sendMailHelper.sendMail(email, this.sendMailHelper.getTemplate(templateCodeType, userInfo.username), emailSubject);
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