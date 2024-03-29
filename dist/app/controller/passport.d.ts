import { FreelogContext } from 'egg-freelog-base';
import { IUserService } from '../../interface';
import { PassportService } from '../service/passport-service';
export declare class passportController {
    jwtAuth: any;
    domain: any;
    ctx: FreelogContext;
    userService: IUserService;
    passportService: PassportService;
    login(): Promise<void>;
    logout(ctx: any): Promise<void>;
}
