import { FreelogContext } from 'egg-freelog-base';
import { IUserService } from '../../interface';
export declare class passportController {
    jwtAuth: any;
    domain: any;
    ctx: FreelogContext;
    userService: IUserService;
    login(): Promise<void>;
    logout(ctx: any): Promise<void>;
    /**
     * 生成jwt载体
     * @param userId
     * @param token
     */
    _generateJwtPayload(userId: number, token: string): {
        iss: string;
        sub: string;
        aud: string;
        exp: number;
        iat: number;
        jti: string;
    };
}
