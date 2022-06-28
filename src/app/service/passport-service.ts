import {config, inject, provide} from 'midway';
import {IUserService, UserInfo} from '../../interface';
import {ArgumentError, FreelogContext, JwtHelper} from 'egg-freelog-base';
import {pick} from 'lodash';

@provide()
export class PassportService {

    @config()
    jwtAuth;
    @config()
    domain: string;
    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;

    /**
     * 写登陆cookie并且保存登陆记录
     * @param userInfo
     * @param jwtType
     * @param isRemember
     */
    async setCookieAndLoginRecord(userInfo: UserInfo, jwtType: 'cookie' | 'header', isRemember?: boolean) {
        if (!userInfo) {
            throw new ArgumentError('缺少参数userInfo');
        }

        const {ctx} = this;
        const {publicKey, privateKey, cookieName} = this.jwtAuth;
        const payLoad = Object.assign(pick(userInfo, ['userId', 'username', 'userType', 'mobile', 'email']), this.generateJwtPayload(userInfo.userId, userInfo.tokenSn));

        const jwtStr = new JwtHelper(publicKey, privateKey).generateToken(payLoad, 1296000);

        if (jwtType === 'cookie') {
            const now = new Date();
            now.setDate(now.getDate() + 7);
            const cookieOptions = {
                httpOnly: true,
                domain: this.domain,
                overwrite: true,
                signed: false,
                expires: isRemember ? now : undefined
            };
            ctx.cookies.set(cookieName, jwtStr, cookieOptions);
            ctx.cookies.set('uid', userInfo.userId.toString(), {...cookieOptions, ...{httpOnly: false}});
        } else {
            ctx.set('Authorization', `Bearer ${jwtStr}`);
        }
        this.userService.updateOneUserDetail({userId: userInfo.userId}, {
            userId: userInfo.userId, latestLoginDate: new Date(), latestLoginIp: ctx.ip,
        }).then().catch(console.error);
        return true;
    }

    /**
     * 生成jwt载体
     * @param userId
     * @param token
     */
    private generateJwtPayload(userId: number, token: string) {
        const currTime = Math.round(new Date().getTime() / 1000);
        return {
            iss: 'https://identity.freelog.com',
            sub: userId.toString(),
            aud: 'freelog-website',
            exp: currTime + 1296000,
            iat: currTime,
            jti: token
        };
    }
}
