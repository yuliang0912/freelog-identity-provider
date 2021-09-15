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
        console.log(fileBuffer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC1pbWFnZS1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXh0ZW5kL2hlYWQtaW1hZ2UtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFzRDtBQUN0RCx1REFBc0c7QUFDdEcsbUNBQXlDO0FBQ3pDLDBDQUF5QztBQUd6QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFJckMsSUFBcUIsa0JBQWtCLDBCQUF2QyxNQUFxQixrQkFBa0I7SUFHbkMsWUFBWSxDQUFDO0lBRWIsbUJBQW1CLENBQW9DO0lBQ3ZELGFBQWEsQ0FBd0I7SUFFckM7Ozs7T0FJRztJQUNILGlCQUFpQixDQUFDLEdBQVcsRUFBRSxRQUFvQjtRQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDakQsTUFBTSxJQUFJLEdBQUcsK0JBQVksQ0FBQyxNQUFNLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZHLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEdBQVcsRUFBRSxRQUFvQjtRQUM5RCxNQUFNLGFBQWEsR0FBRyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FB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