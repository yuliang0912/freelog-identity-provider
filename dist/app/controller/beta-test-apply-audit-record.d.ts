import { FreelogContext } from 'egg-freelog-base';
import { ITestQualificationApplyAuditService, IUserService } from "../../interface";
export declare class betaTestApplyAuditRecordController {
    ctx: FreelogContext;
    userService: IUserService;
    testQualificationApplyAuditService: ITestQualificationApplyAuditService;
    index(): Promise<FreelogContext>;
    create(): Promise<void>;
    show(): Promise<void>;
    batchUpdate(): Promise<FreelogContext>;
    update(): Promise<void>;
}
