import {config, inject, provide, scope} from 'midway';
import {ApplicationError, CryptoHelper, FreelogContext, IObjectStorageService} from 'egg-freelog-base';
import {random, cloneDeep} from 'lodash';
import * as identicon from 'identicon.js';
import * as Stream from 'stream';

const fileType = require('file-type');

@provide()
@scope('Singleton')
export default class headImageGenerator {

    @config()
    uploadConfig;
    @inject()
    aliOssClientFactory: (config) => IObjectStorageService;
    _aliOssClient: IObjectStorageService;

    /**
     * 生成头像
     * @param key 用于产生hash值的key
     * @param schemeId
     */
    generateHeadImage(key: string, schemeId?: 1 | 2 | 3) {
        const options = this._getGenerateScheme(schemeId);
        const hash = CryptoHelper.sha512(`FREELOG_HEAD_IMAGE_GENERATOR_KEY_${key ?? Math.random().toString()}`);
        return new identicon(hash, options).toString();
    }

    /**
     * 生成并上传头像
     * @param key
     * @param schemeId
     */
    async generateAndUploadHeadImage(key: string, schemeId?: 1 | 2 | 3): Promise<string> {
        const fileObjectKey = `headImage/${key}`;
        const fileBuffer = Buffer.from(this.generateHeadImage(key), 'base64');
        await this.ossClient.putBuffer(fileObjectKey, fileBuffer, {headers: {'Content-Type': 'image/png'}});
        return `https://image.freelog.com/${fileObjectKey}`;
    }

    get ossClient(): IObjectStorageService {
        if (!this._aliOssClient) {
            const aliOssConfig = cloneDeep(this.uploadConfig.aliOss);
            aliOssConfig.accessKeyId = CryptoHelper.base64Decode(aliOssConfig.accessKeyId);
            aliOssConfig.accessKeySecret = CryptoHelper.base64Decode(aliOssConfig.accessKeySecret);
            this._aliOssClient = this.aliOssClientFactory(aliOssConfig);
        }
        return this._aliOssClient;
    }

    /**
     * 检查头像文件
     * @param ctx
     * @param fileStream
     */
    checkHeadImage(ctx: FreelogContext, fileStream: Stream) {
        let chunks = [];
        return new Promise((resolve, reject) => {
            fileStream.on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks))).on('error', reject);
        }).then(fileBuffer => {
            const {ext, mime} = this._checkMimeType(ctx, fileBuffer);
            return {ext, mime, fileBuffer};
        });
    }

    /**
     * 检查mimetype
     * @param ctx
     * @param fileBuffer
     */
    _checkMimeType(ctx: FreelogContext, fileBuffer) {
        const {ext, mime} = fileType(fileBuffer);
        if (!/^image\/(png|gif|jpeg)$/i.test(mime) || !/^(png|gif|jpg)$/i.test(ext)) {
            throw new ApplicationError(ctx.gettext('head-image-extension-validate-failed', '(png|gif|jpg)'), {
                ext, mime
            });
        }
        if (fileBuffer.length > 14385152) {
            throw new ApplicationError(ctx.gettext('head-image-size-limit-validate-failed', '2MB'), {fileSize: fileBuffer.length});
        }
        return {ext, mime};
    }

    /***
     * 获取配色方案
     * @param schemeId
     * @returns {*}
     * @private
     */
    _getGenerateScheme(schemeId) {
        if (![1, 2, 3].includes(schemeId)) {
            schemeId = random(1, 3);
        }
        return headImageGenerator.headImageSchemes[schemeId - 1];
    }

    /**
     * 所有的配色方案
     */
    static headImageSchemes = [
        {
            foreground: [0, 0, 220, 255],
            background: [255, 255, 255, 255],
            margin: 0.2,
            size: 200,
            format: 'PNG'
        },
        {
            foreground: [0, 245, 245, 245],
            background: [255, 255, 255, 255],
            margin: 0.2,
            size: 200,
            format: 'PNG'
        },
        {
            foreground: [0, 235, 0, 255],
            background: [255, 255, 255, 255],
            margin: 0.2,
            size: 200,
            format: 'PNG'
        }
    ];
}
