import { findOptions, IUserService, TestQualificationApplyAuditRecordInfo, TestQualificationAuditHandleInfo, UserInfo } from "../../interface";
import { FreelogContext, MongodbOperation, PageResult } from "egg-freelog-base";
import SendSmsHelper from "../../extend/send-sms-helper";
import SendMailHelper from "../../extend/send-mail-helper";
export declare class TestQualificationApplyAuditService {
    ctx: FreelogContext;
    userService: IUserService;
    sendSmsHelper: SendSmsHelper;
    sendMailHelper: SendMailHelper;
    testQualificationApplyAuditProvider: MongodbOperation<TestQualificationApplyAuditRecordInfo>;
    /**
     * 删除测试资格申请记录
     * @param userId
     */
    deleteTestQualificationApplyRecord(userId: number): Promise<{
        n: number;
        nModified: number;
        ok: number;
    }>;
    /**
     * 分页查找申请记录
     * @param condition
     * @param options
     */
    findIntervalList(condition: object, options?: findOptions<UserInfo>): Promise<PageResult<TestQualificationApplyAuditRecordInfo>>;
    /**
     * 查找一条数据
     * @param condition
     */
    findOne(condition: Partial<TestQualificationApplyAuditRecordInfo>): Promise<TestQualificationApplyAuditRecordInfo>;
    /**
     * 申请测试资格
     * @param applyInfo
     */
    testQualificationApply(applyInfo: Partial<TestQualificationApplyAuditRecordInfo>): Promise<TestQualificationApplyAuditRecordInfo>;
    /**
     * 修改测试资格申请
     * @param applyInfo
     * @param handleInfo
     */
    updateTestQualificationApply(applyInfo: TestQualificationApplyAuditRecordInfo, handleInfo: TestQualificationAuditHandleInfo): Promise<{
        n: number;
        nModified: number;
        ok: number;
    }>;
    /**
     * 审核申请信息
     * @param ApplyRecordInfo
     * @param handleInfo
     * @returns {Promise<Boolean>}
     */
    auditTestQualificationApply(applyRecordInfo: TestQualificationApplyAuditRecordInfo, handleInfo: TestQualificationAuditHandleInfo): Promise<boolean>;
    /**
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    sendAuditNoticeMessage(userInfo: UserInfo, auditStatus: 0 | 1): Promise<any>;
}
