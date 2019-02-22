'use strict'

const fileType = require('file-type')
const {ApplicationError} = require('egg-freelog-base/error')

module.exports = class HeadImageFileCheck {

    /**
     * 图片文件检查
     * @returns {Promise<any>}
     */
    check(ctx, fileStream) {
        let chunks = []
        return new Promise((resolve, reject) => {
            fileStream.on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks))).on('error', reject)
        }).then(fileBuffer => {
            const {ext, mime} = this._checkMimeType(ctx, fileBuffer)
            return {ext, mime, fileBuffer}
        })
    }

    /**
     * 检查mimetype
     * @param mimeType
     */
    _checkMimeType(ctx, fileBuffer) {
        const {ext, mime} = fileType(fileBuffer)
        if (!/^image\/(png|gif|jpeg)$/i.test(mime) || !/^(png|gif|jpg)$/i.test(ext)) {
            throw new ApplicationError(ctx.gettext('head-image-extension-validate-failed', '(png|gif|jpg)'), {
                ext, mime
            })
        }
        if (fileBuffer.length > 14385152) {
            throw new ApplicationError(ctx.gettext('head-image-size-limit-validate-failed', '2MB'), {fileSize: fileBuffer.length})
        }
        return {ext, mime}
    }
}
