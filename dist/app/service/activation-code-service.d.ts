import { ActivationCodeInfo, findOptions, IActivationCodeService } from "../../interface";
import { FreelogContext, IMongodbOperation, PageResult } from "egg-freelog-base";
export declare class ActivationCodeService implements IActivationCodeService {
    ctx: FreelogContext;
    activationCodeProvider: IMongodbOperation<ActivationCodeInfo>;
    count(condition: object): Promise<number>;
    find(condition: object, options?: findOptions<ActivationCodeInfo>): Promise<ActivationCodeInfo[]>;
    findIntervalList(condition: object, options?: findOptions<ActivationCodeInfo>): Promise<PageResult<ActivationCodeInfo>>;
    findOne(condition: object, options?: findOptions<ActivationCodeInfo>): Promise<ActivationCodeInfo>;
    /**
     * 批量创建
     * @param createQuantity
     * @param options
     */
    batchCreate(createQuantity: number, options: Partial<ActivationCodeInfo>): Promise<ActivationCodeInfo[]>;
    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes: string[], status: 0 | 1): Promise<boolean>;
}
