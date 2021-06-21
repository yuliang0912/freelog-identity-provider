import { FreelogContext } from 'egg-freelog-base';
import { IActivationCodeService, IUserService } from '../../interface';
export declare class activationCodeController {
    ctx: FreelogContext;
    userService: IUserService;
    activationCodeService: IActivationCodeService;
    index(): Promise<void>;
    batchCreate(): Promise<void>;
    batchUpdate(): Promise<void>;
    activateTestQualification(): Promise<void>;
    usedRecords(): Promise<void>;
    show(): Promise<void>;
}
