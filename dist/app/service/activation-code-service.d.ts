import { ActivationCodeInfo, ActivationCodeUsedRecord, findOptions, IActivationCodeService, IUserService, UserInfo } from "../../interface";
import { FreelogContext, IMongodbOperation, PageResult } from "egg-freelog-base";
export declare class ActivationCodeService implements IActivationCodeService {
    ctx: FreelogContext;
    userService: IUserService;
    activationCodeProvider: IMongodbOperation<ActivationCodeInfo>;
    activationCodeUsedRecordProvider: IMongodbOperation<ActivationCodeUsedRecord>;
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
    /**
     * 使用授权码激活测试资格
     * @param userId
     * @param code
     */
    activateAuthorizationCode(userInfo: UserInfo, code: string): Promise<boolean>;
    /**
     * 查询激活码使用记录
     * @param condition
     * @param options
     */
    findUsedRecordIntervalList(condition: object, options?: findOptions<ActivationCodeUsedRecord>): Promise<PageResult<ActivationCodeUsedRecord>>;
}
