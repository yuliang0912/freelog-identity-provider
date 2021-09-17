import {inject, provide} from "midway";
import {
    ActivationCodeInfo,
    ActivationCodeUsedRecord,
    findOptions,
    IActivationCodeService, IUserService,
    UserInfo
} from "../../interface";
import {ApplicationError, CryptoHelper, FreelogContext, IMongodbOperation, PageResult} from "egg-freelog-base";
import {v4} from 'uuid';
import {ActivationCodeStatusEnum} from "../../enum";
import {isDate} from 'lodash'

@provide()
export class ActivationCodeService implements IActivationCodeService {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
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
                limitCount: options.limitCount ?? 0,
                endEffectiveDate: options?.endEffectiveDate ?? null,
                startEffectiveDate: options?.startEffectiveDate ?? null
            })
        }
        return this.activationCodeProvider.insertMany(codes);
    }

    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes: string[], status: 0 | 1): Promise<boolean> {
        return this.activationCodeProvider.updateMany({code: {$in: codes}}, {status}).then(t => Boolean(t.nModified));
    }

    /**
     * 使用授权码激活测试资格
     * @param userInfo
     * @param code
     */
    async activateAuthorizationCode(userInfo: UserInfo, code: string): Promise<boolean> {

        const activationCodeInfo = await this.activationCodeProvider.findOne({code, codeType: 'beta'});
        if (!activationCodeInfo || activationCodeInfo.status === ActivationCodeStatusEnum.disabled
            || (activationCodeInfo.limitCount > 0 && activationCodeInfo.usedCount >= activationCodeInfo.limitCount)) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'))
        }
        if (isDate(activationCodeInfo.startEffectiveDate) && activationCodeInfo.startEffectiveDate > new Date()) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'))
        }
        if (isDate(activationCodeInfo.endEffectiveDate) && activationCodeInfo.endEffectiveDate < new Date()) {
            throw new ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'))
        }

        const task1 = this.activationCodeProvider.updateOne({code}, {$inc: {usedCount: 1}});
        const task2 = this.activationCodeUsedRecordProvider.create({
            code, userId: userInfo.userId, username: userInfo.username, loginIp: this.ctx.ip
        });
        const task3 = this.userService.updateOne({userId: userInfo.userId}, {userType: userInfo.userType | 1});

        return Promise.all([task1, task2, task3]).then(() => true);
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

