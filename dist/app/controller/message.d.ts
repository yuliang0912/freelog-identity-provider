import { FreelogContext } from 'egg-freelog-base';
import { IMessageService, IUserService } from '../../interface';
export declare class messageController {
    ctx: FreelogContext;
    userService: IUserService;
    messageService: IMessageService;
    /**
     * 发送验证码
     */
    send(): Promise<FreelogContext>;
    /**
     * 核验验证码是否输入正确
     */
    verify(): Promise<FreelogContext>;
}
