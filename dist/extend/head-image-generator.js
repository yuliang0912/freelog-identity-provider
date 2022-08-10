"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var headImageGenerator_1;
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const lodash_1 = require("lodash");
const identicon = require("identicon.js");
const fileType = require('file-type');
let headImageGenerator = headImageGenerator_1 = class headImageGenerator {
    uploadConfig;
    aliOssClientFactory;
    _aliOssClient;
    /**
     * 生成头像
     * @param key 用于产生hash值的key
     * @param schemeId
     */
    generateHeadImage(key, schemeId) {
        const options = this._getGenerateScheme(schemeId);
        const hash = egg_freelog_base_1.CryptoHelper.sha512(`FREELOG_HEAD_IMAGE_GENERATOR_KEY_${key ?? Math.random().toString()}`);
        return new identicon(hash, options).toString();
    }
    /**
     * 生成并上传头像
     * @param key
     * @param schemeId
     */
    async generateAndUploadHeadImage(key, schemeId) {
        const fileObjectKey = `headImage/${key}`;
        const fileBuffer = Buffer.from(this.generateHeadImage(key), 'base64');
        await this.ossClient.putBuffer(fileObjectKey, fileBuffer, { headers: { 'Content-Type': 'image/png' } });
        return `https://image.freelog.com/${fileObjectKey}`;
    }
    get ossClient() {
        if (!this._aliOssClient) {
            const aliOssConfig = (0, lodash_1.cloneDeep)(this.uploadConfig.aliOss);
            aliOssConfig.accessKeyId = egg_freelog_base_1.CryptoHelper.base64Decode(aliOssConfig.accessKeyId);
            aliOssConfig.accessKeySecret = egg_freelog_base_1.CryptoHelper.base64Decode(aliOssConfig.accessKeySecret);
            this._aliOssClient = this.aliOssClientFactory(aliOssConfig);
        }
        return this._aliOssClient;
    }
    /**
     * 检查头像文件
     * @param ctx
     * @param fileStream
     */
    checkHeadImage(ctx, fileStream) {
        let chunks = [];
        return new Promise((resolve, reject) => {
            fileStream.on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks))).on('error', reject);
        }).then(fileBuffer => {
            const { ext, mime } = this._checkMimeType(ctx, fileBuffer);
            return { ext, mime, fileBuffer };
        });
    }
    /**
     * 检查mimetype
     * @param ctx
     * @param fileBuffer
     */
    _checkMimeType(ctx, fileBuffer) {
        const { ext, mime } = fileType(fileBuffer);
        if (!/^image\/(png|gif|jpeg)$/i.test(mime) || !/^(png|gif|jpg)$/i.test(ext)) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('head-image-extension-validate-failed', '(png|gif|jpg)'), {
                ext, mime
            });
        }
        if (fileBuffer.length > 14385152) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('head-image-size-limit-validate-failed', '2MB'), { fileSize: fileBuffer.length });
        }
        return { ext, mime };
    }
    /***
     * 获取配色方案
     * @param schemeId
     * @returns {*}
     * @private
     */
    _getGenerateScheme(schemeId) {
        if (![1, 2, 3].includes(schemeId)) {
            schemeId = (0, lodash_1.random)(1, 3);
        }
        return headImageGenerator_1.headImageSchemes[schemeId - 1];
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
};
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], headImageGenerator.prototype, "uploadConfig", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Function)
], headImageGenerator.prototype, "aliOssClientFactory", void 0);
headImageGenerator = headImageGenerator_1 = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton')
], headImageGenerator);
exports.default = headImageGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC1pbWFnZS1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXh0ZW5kL2hlYWQtaW1hZ2UtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFzRDtBQUN0RCx1REFBdUc7QUFDdkcsbUNBQXlDO0FBQ3pDLDBDQUEwQztBQUcxQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFJdEMsSUFBcUIsa0JBQWtCLDBCQUF2QyxNQUFxQixrQkFBa0I7SUFHbkMsWUFBWSxDQUFDO0lBRWIsbUJBQW1CLENBQW9DO0lBQ3ZELGFBQWEsQ0FBd0I7SUFFckM7Ozs7T0FJRztJQUNILGlCQUFpQixDQUFDLEdBQVcsRUFBRSxRQUFvQjtRQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQUcsK0JBQVksQ0FBQyxNQUFNLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hHLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEdBQVcsRUFBRSxRQUFvQjtRQUM5RCxNQUFNLGFBQWEsR0FBRyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFD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