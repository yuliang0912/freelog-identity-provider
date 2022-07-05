import { FreelogContext } from 'egg-freelog-base';
import { ThirdPartyIdentityService } from '../service/third-party-identity-service';
import { IUserService } from '../../interface';
import { PassportService } from '../service/passport-service';
export declare class ThirdPartyController {
    ctx: FreelogContext;
    thirdPartyIdentityService: ThirdPartyIdentityService;
    userService: IUserService;
    passportService: PassportService;
    getWeChatToken(): Promise<void>;
    registerOrBindUser(): Promise<void>;
    bindWeChat(): Promise<void>;
}
