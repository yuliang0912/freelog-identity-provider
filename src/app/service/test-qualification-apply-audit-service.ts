import {inject, provide} from "midway";
import {
    findOptions,
    IUserService,
    TestQualificationApplyAuditRecordInfo,
    TestQualificationAuditHandleInfo, UserInfo
} from "../../interface";
import {ApplicationError, FreelogContext, MongodbOperation, PageResult} from "egg-freelog-base";
import SendSmsHelper from "../../extend/send-sms-helper";
import SendMailHelper from "../../extend/send-mail-helper";

@provide()
export class TestQualificationApplyAuditService {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    sendSmsHelper: SendSmsHelper;
    @inject()
    sendMailHelper: SendMailHelper;
    @inject()
    testQualificationApplyAuditProvider: MongodbOperation<TestQualificationApplyAuditRecordInfo>;

    /**
     * 删除测试资格申请记录
     * @param userId
     */
    async deleteTestQualificationApplyRecord(userId: number) {
        return this.testQualificationApplyAuditProvider.deleteMany({userId});
    }

    /**
     * 分页查找申请记录
     * @param condition
     * @param options
     */
    async findIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<TestQualificationApplyAuditRecordInfo>> {
        return this.testQualificationApplyAuditProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }

    /**
     * 查找一条数据
     * @param condition
     */
    async findOne(condition: Partial<TestQualificationApplyAuditRecordInfo>) {
        return this.testQualificationApplyAuditProvider.findOne(condition);
    }

    /**
     * 申请测试资格
     * @param applyInfo
     */
    async testQualificationApply(applyInfo: Partial<TestQualificationApplyAuditRecordInfo>) {

        const userApplyRecord = await this.testQualificationApplyAuditProvider.findOne({
            userId: this.ctx.userId, status: 0
        });
        if (userApplyRecord) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-apply-existing-error'))
        }

        applyInfo.userId = this.ctx.userId;
        return this.testQualificationApplyAuditProvider.create(applyInfo);
    }

    /**
     * 修改测试资格申请
     * @param applyInfo
     * @param handleInfo
     */
    async updateTestQualificationApply(applyInfo: TestQualificationApplyAuditRecordInfo, handleInfo: TestQualificationAuditHandleInfo) {
        return this.testQualificationApplyAuditProvider.updateOne({_id: applyInfo.id}, {
            operationUserId: this.ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg
        })
    }

    /**
     * 审核申请信息
     * @param ApplyRecordInfo
     * @param handleInfo
     * @returns {Promise<Boolean>}
     */
    async auditTestQualificationApply(applyRecordInfo: TestQualificationApplyAuditRecordInfo, handleInfo: TestQualificationAuditHandleInfo) {

        const {ctx} = this;
        const userInfo = await this.userService.findOne({userId: applyRecordInfo.userId});
        if ((userInfo.userType & 1) === 1) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'))
        }

        const task1 = this.testQualificationApplyAuditProvider.updateOne({_id: applyRecordInfo.id}, {
            operationUserId: ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg
        })

        let task2 = undefined;
        if (handleInfo.status === 1) {
            task2 = this.userService.updateOne({userId: userInfo.userId}, {userType: userInfo.userType | 1});
        }

        await Promise.all([task1, task2]).then(() => {
            return this.sendAuditNoticeMessage(userInfo, handleInfo.status)
        })

        return true
    }

    /**
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    async sendAuditNoticeMessage(userInfo: UserInfo, auditStatus: 0 | 1) {

        const {mobile, username, email} = userInfo
        const templateCodeType = auditStatus === 1 ? "auditPass" : "auditFail"

        if (mobile) {
            return this.sendSmsHelper.sendSMS(mobile, this.sendSmsHelper.getTemplate(templateCodeType), {
                username,
                phone: mobile.substr(mobile.length - 4),
                path: auditStatus === 1 ? '' : 'alpha-test/apply'
            })
        } else if (email) {
            return this.sendMailHelper.sendMail(email, this.sendMailHelper.getTemplate(templateCodeType, userInfo.username));
        }
    }
}
