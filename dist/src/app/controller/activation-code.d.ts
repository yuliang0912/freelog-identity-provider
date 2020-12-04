import { FreelogContext } from 'egg-freelog-base';
import { IActivationCodeService } from "../../interface";
export declare class activationCodeController {
    ctx: FreelogContext;
    activationCodeService: IActivationCodeService;
    index(): Promise<void>;
    /**
     * 查看详情
     * @param ctx
     * @returns {Promise<void>}
     */
    show(): Promise<void>;
    batchCreate(): Promise<void>;
    batchUpdate(): Promise<void>;
}
