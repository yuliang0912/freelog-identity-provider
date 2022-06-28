import { IUserService, UserInfo } from '../../interface';
import { FreelogContext } from 'egg-freelog-base';
export declare class PassportService {
    jwtAuth: any;
    domain: string;
    ctx: FreelogContext;
    userService: IUserService;
    /**
     * 写登陆cookie并且保存登陆记录
     * @param userInfo
     * @param jwtType
     * @param isRemember
     */
    setCookieAndLoginRecord(userInfo: UserInfo, jwtType: 'cookie' | 'header', isRemember?: boolean): Promise<boolean>;
    /**
     * 生成jwt载体
     * @param userId
     * @param token
     */
    private generateJwtPayload;
}
