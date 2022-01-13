import { ITageService } from '../../interface';
import { FreelogContext } from 'egg-freelog-base';
export declare class TagInfoController {
    ctx: FreelogContext;
    tagService: ITageService;
    create(): Promise<void>;
    index(): Promise<void>;
    destroy(): Promise<void>;
    update(): Promise<void>;
}
