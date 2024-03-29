import {inject, provide} from 'midway';
import {
    findOptions,
    ITestQualificationApplyAuditService,
    IUserService,
    TestQualificationApplyAuditRecordInfo,
    TestQualificationAuditHandleInfo,
    UserInfo
} from '../../interface';
import {ApplicationError, FreelogContext, MongodbOperation, PageResult} from 'egg-freelog-base';
import SendSmsHelper from '../../extend/send-sms-helper';
import SendMailHelper from '../../extend/send-mail-helper';
import {AuditStatusEnum, AuthCodeTypeEnum} from '../../enum';
import {deleteUndefinedFields} from 'egg-freelog-base/lib/freelog-common-func';

@provide()
export class TestQualificationApplyAuditService implements ITestQualificationApplyAuditService {

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
     * 分页查找申请记录
     * @param condition
     * @param status
     * @param options
     */
    async findSearchIntervalList(condition: Partial<UserInfo>, status?: number, options?: findOptions<UserInfo>): Promise<PageResult<TestQualificationApplyAuditRecordInfo>> {

        const pipeline: any = [
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
            pipeline.unshift({$match: {status}});
        }
        for (const [key, value] of Object.entries(condition)) {
            pipeline.push({$match: {[`userInfos.${key}`]: value}});
        }

        const [totalItemInfo] = await this.testQualificationApplyAuditProvider.aggregate([...pipeline, ...[{$count: 'totalItem'}]]);
        const {totalItem = 0} = totalItemInfo ?? {};

        pipeline.push({$sort: options?.sort ?? {userId: -1}}, {$skip: options?.skip ?? 0}, {$limit: options?.limit ?? 10});
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
    async findOne(condition: Partial<TestQualificationApplyAuditRecordInfo> | object, ...args): Promise<TestQualificationApplyAuditRecordInfo> {
        return this.testQualificationApplyAuditProvider.findOne(condition, ...args);
    }

    /**
     * 查找多条数据
     * @param condition
     */
    async find(condition: Partial<TestQualificationApplyAuditRecordInfo> | object): Promise<TestQualificationApplyAuditRecordInfo[]> {
        return this.testQualificationApplyAuditProvider.find(condition);
    }

    /**
     * 申请测试资格
     * @param applyInfo
     */
    async testQualificationApply(applyInfo: Partial<TestQualificationApplyAuditRecordInfo>): Promise<TestQualificationApplyAuditRecordInfo> {

        const userApplyRecord = await this.testQualificationApplyAuditProvider.findOne({
            userId: this.ctx.userId, status: AuditStatusEnum.WaitReview
        });
        if (userApplyRecord) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-apply-existing-error'));
        }
        applyInfo.userId = this.ctx.userId;
        applyInfo.status = AuditStatusEnum.WaitReview;
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
        });
    }

    /**
     * 审核申请信息
     * @param applyRecordInfo
     * @param handleInfo
     * @returns {Promise<Boolean>}
     */
    async auditTestQualificationApply(applyRecordInfo: TestQualificationApplyAuditRecordInfo, handleInfo: TestQualificationAuditHandleInfo) {

        const {ctx} = this;
        const userInfo = await this.userService.findOne({userId: applyRecordInfo.userId});
        if ((userInfo.userType & 1) === 1) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'));
        }

        const task1 = this.testQualificationApplyAuditProvider.updateOne({_id: applyRecordInfo.id}, deleteUndefinedFields({
            operationUserId: ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg,
            remark: handleInfo.remark
        }));

        let task2 = undefined;
        if (handleInfo.status === 1) {
            task2 = this.userService.updateOne({userId: userInfo.userId}, {userType: userInfo.userType | 1});
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
    async batchAuditTestQualificationApply(applyRecordList: TestQualificationApplyAuditRecordInfo[], handleInfo: TestQualificationAuditHandleInfo) {

        const task1 = this.testQualificationApplyAuditProvider.updateMany({_id: {$in: applyRecordList.map(x => x['_id'])}}, deleteUndefinedFields({
            operationUserId: this.ctx.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg,
            remark: handleInfo.remark
        }));

        let task2 = undefined;
        if (handleInfo.status === AuditStatusEnum.AuditPass) {
            task2 = this.userService.updateMany({userId: {$in: applyRecordList.map(x => x.userId)}}, {userType: 1});
        }

        await Promise.all([task1, task2]);

        this.userService.find({userId: {$in: applyRecordList.map(x => x.userId)}}).then(userList => {
            userList.forEach(userInfo => this.sendAuditNoticeMessage(userInfo, handleInfo.status));
        });

        return true;
    }

    /**
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    async sendAuditNoticeMessage(userInfo: UserInfo, auditStatus: 0 | 1) {

        const {mobile, username, email} = userInfo;
        const templateCodeType = auditStatus === 1 ? AuthCodeTypeEnum.AuditPass : AuthCodeTypeEnum.AuditFail;

        if (mobile) {
            return this.sendSmsHelper.sendSMS(mobile, this.sendSmsHelper.getTemplate(templateCodeType), {
                username,
                phone: mobile.substr(mobile.length - 4),
                path: auditStatus === 1 ? '' : 'invitation'
            });
        } else if (email) {
            const emailSubject = templateCodeType === AuthCodeTypeEnum.AuditPass ? '【Freelog】内测申请通过' : '【Freelog】内测申请未通过';
            return this.sendMailHelper.sendMail(email, this.sendMailHelper.getTemplate(templateCodeType, userInfo.username), emailSubject);
        }
    }
}
