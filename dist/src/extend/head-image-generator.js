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
            const aliOssConfig = lodash_1.cloneDeep(this.uploadConfig.aliOss);
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
            schemeId = lodash_1.random(1, 3);
        }
        return headImageGenerator_1.headImageSchemes[schemeId - 1];
    }
};
/**
 * 所有的配色方案
 */
headImageGenerator.headImageSchemes = [
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
__decorate([
    midway_1.config(),
    __metadata("design:type", Object)
], headImageGenerator.prototype, "uploadConfig", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Function)
], headImageGenerator.prototype, "aliOssClientFactory", void 0);
headImageGenerator = headImageGenerator_1 = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton')
], headImageGenerator);
exports.default = headImageGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC1pbWFnZS1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXh0ZW5kL2hlYWQtaW1hZ2UtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFzRDtBQUN0RCx1REFBc0c7QUFDdEcsbUNBQXlDO0FBQ3pDLDBDQUF5QztBQUd6QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFJckMsSUFBcUIsa0JBQWtCLDBCQUF2QyxNQUFxQixrQkFBa0I7SUFRbkM7Ozs7T0FJRztJQUNILGlCQUFpQixDQUFDLEdBQVcsRUFBRSxRQUFvQjtRQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDakQsTUFBTSxJQUFJLEdBQUcsK0JBQVksQ0FBQyxNQUFNLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZHLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEdBQVcsRUFBRSxRQUFvQjtRQUM5RCxNQUFNLGFBQWEsR0FBRyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsY0FBYyxF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