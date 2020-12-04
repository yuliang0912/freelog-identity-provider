import {inject, provide} from "midway";
import {ActivationCodeInfo, findOptions, IActivationCodeService} from "../../interface";
import {CryptoHelper, FreelogContext, IMongodbOperation, PageResult} from "egg-freelog-base";
import {v4} from 'uuid';

@provide()
export class ActivationCodeService implements IActivationCodeService {

    @inject()
    ctx: FreelogContext;
    @inject()
    activationCodeProvider: IMongodbOperation<ActivationCodeInfo>;

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
}

