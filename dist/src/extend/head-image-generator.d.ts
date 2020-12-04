/// <reference types="node" />
import { FreelogContext, IObjectStorageService } from 'egg-freelog-base';
import * as Stream from "stream";
export default class headImageGenerator {
    uploadConfig: any;
    aliOssClientFactory: (config: any) => IObjectStorageService;
    _aliOssClient: IObjectStorageService;
    /**
     * 生成头像
     * @param key 用于产生hash值的key
     * @param schemeId
     */
    generateHeadImage(key: string, schemeId?: 1 | 2 | 3): any;
    /**
     * 生成并上传头像
     * @param key
     * @param schemeId
     */
    generateAndUploadHeadImage(key: string, schemeId?: 1 | 2 | 3): Promise<string>;
    get ossClient(): IObjectStorageService;
    /**
     * 检查头像文件
     * @param ctx
     * @param fileStream
     */
    checkHeadImage(ctx: FreelogContext, fileStream: Stream): Promise<{
        ext: any;
        mime: any;
        fileBuffer: unknown;
    }>;
    /**
     * 检查mimetype
     * @param ctx
     * @param fileBuffer
     */
    _checkMimeType(ctx: FreelogContext, fileBuffer: any): {
        ext: any;
        mime: any;
    };
    /***
     * 获取配色方案
     * @param schemeId
     * @returns {*}
     * @private
     */
    _getGenerateScheme(schemeId: any): {
        foreground: number[];
        background: number[];
        margin: number;
        size: number;
        format: string;
    };
    /**
     * 所有的配色方案
     */
    static headImageSchemes: {
        foreground: number[];
        background: number[];
        margin: number;
        size: number;
        format: string;
    }[];
}
