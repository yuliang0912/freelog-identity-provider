import {inject, provide} from 'midway';
import {
    ActivationCodeInfo,
    ActivationCodeUsedRecord,
    findOptions,
    IActivationCodeService,
    IUserService,
    UserInfo
} from '../../interface';
import {ApplicationError, CryptoHelper, FreelogContext, IMongodbOperation, PageResult} from 'egg-freelog-base';
import {v4} from 'uuid';
import {UserStatusEnum} from '../../enum';
import {first, isDate, pick} from 'lodash';
import {deleteUndefinedFields} from 'egg-freelog-base/lib/freelog-common-func';
import {OutsideApiService} from './outside-api-service';

@provide()
export class ActivationCodeService implements IActivationCodeService {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    outsideApiService: OutsideApiService;
    @inject()
    activationCodeProvider: IMongodbOperation<ActivationCodeInfo>;
    @inject()
    activationCodeUsedRecordProvider: IMongodbOperation<ActivationCodeUsedRecord>;

    count(condition: object): Promise<number> {
        return this.activationCodeProvider.count(condition);
    }

    find(condition: object, options?: findOptions<ActivationCodeInfo>): Promise<ActivationCodeInfo[]> {
        return this.activationCodeProvider.find(condition, options?.projection, options);
    }

    findIntervalList(condition: object, options?: findOptions<ActivationCodeInfo>): Promise<PageResult<ActivationCodeInfo>> {
        return this.activationCodeProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }

    findOne(condition: object, options?: findOptions<ActivationCodeInfo>): Promise<ActivationCodeInfo> {
        return this.activationCodeProvider.findOne(condition);
    }

    /**
     * 批量创建
     * @param createQuantity
     * @param options
     */
    batchCreate(createQuantity: number, options: Partial<ActivationCodeInfo>): Promise<ActivationCodeInfo[]> {

        const codes: Partial<ActivationCodeInfo>[] = [];
        createQuantity = createQuantity < 1 ? 1 : createQuantity > 50 ? 50 : createQuantity;
        while (codes.length < createQuantity) {
            const code = CryptoHelper.base64Encode(v4() + v4()).substr(0, 8);
            codes.push({
                code, codeType: 'beta',
                userId: options.userId ?? 0,
                username: options.username ?? '',
                limitCount: options.limitCount ?? 0,
                endEffectiveDate: options?.endEffectiveDate ?? null,
                startEffectiveDate: options?.startEffectiveDate ?? null,
                remark: options.remark ?? ''
            });
        }
        return this.activationCodeProvider.insertMany(codes);
    }

    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes: string[], status: 0 | 1, remark?: string): Promise<boolean> {
        const updateModel = deleteUndefinedFields({status, remark});
        return this.activationCodeProvider.updateMany({code: {$in: codes}}, updateModel).then(t => Boolean(t.nModified));
    }

    /**
     * 根据被邀请人查询邀请者信息
     * @param inviteeUserId
     */
    async getInviterInfo(inviteeUserId: number) {
        const activationCodeUsedRecord = await this.activationCodeUsedRecordProvider.findOne({userId: inviteeUserId});
        if (!activationCodeUsedRecord) {
            return null;
        }
        const codeInfo = await this.activationCodeProvider.findOne({code: activationCodeUsedRecord.code});
        if (!codeInfo.userId) {
            return null;
        }
        return pick(codeInfo, ['userId', 'username']);
    }

    /**
     * 使用授权码激活测试资格
     * @param userInfo
     * @param code
     */
    async activateAuthorizationCode(userInfo: UserInfo, code: string): Promise<boolean> {

        const activationCodeInfo = await this.activationCodeProvider.findOne({code, codeType: 'beta'});
        if (!activationCodeInfo || activationCodeInfo.status === 1
            || (activationCodeInfo.limitCount > 0 && activationCodeInfo.usedCount >= activationCodeInfo.limitCount)) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        if (isDate(activationCodeInfo.startEffectiveDate) && activationCodeInfo.startEffectiveDate > new Date()) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        if (isDate(activationCodeInfo.endEffectiveDate) && activationCodeInfo.endEffectiveDate < new Date()) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }

        const task1 = this.activationCodeProvider.updateOne({code}, {$inc: {usedCount: 1}});
        const task2 = this.activationCodeUsedRecordProvider.create({
            code, userId: userInfo.userId, username: userInfo.username, loginIp: this.ctx.ip
        });
        const task3 = this.userService.updateOne({userId: userInfo.userId}, {
            userType: userInfo.userType | 1,
            status: 0
        });

        await Promise.all([task1, task2, task3]);

        if (activationCodeInfo.userId) {
            this.outsideApiService.sendActivityEvent('TS000015', activationCodeInfo.userId).catch(console.error);
        }

        return true;
    }

    /**
     * 获取用户的邀请码(如果是已激活用户,且没有激活码,则自动生成一个3次有效机会的邀请码)
     * @param userInfo
     */
    async findOrCreateUserActivationCode(userInfo: UserInfo): Promise<ActivationCodeInfo> {
        // 未激活或被冻结的用户无法获得激活码
        if (userInfo?.status !== UserStatusEnum.Normal) {
            return null;
        }
        const userCodeInfo = await this.activationCodeProvider.findOne({userId: userInfo.userId}, undefined, {sort: {createDate: -1}});
        if (!userCodeInfo) {
            return this.batchCreate(1, {
                userId: userInfo.userId,
                username: userInfo.username, limitCount: 3,
                status: 0,
                startEffectiveDate: new Date(),
                endEffectiveDate: new Date(2022, 12, 31)
            }).then(first);
        }
        return userCodeInfo;
    }

    /**
     * 查询激活码使用记录
     * @param condition
     * @param options
     */
    findUsedRecordIntervalList(condition: object, options?: findOptions<ActivationCodeUsedRecord>): Promise<PageResult<ActivationCodeUsedRecord>> {
        return this.activationCodeUsedRecordProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
}

