'use strict'

const fileType = require('file-type')

module.exports = class HeadImageFileCheck {

    /**
     * 图片文件检查
     * @returns {Promise<any>}
     */
    check(fileStream) {
        let chunks = []
        return new Promise((resolve, reject) => {
            fileStream.on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks))).on('error', reject)
        }).then(fileBuffer => {
            const {ext, mime} = this._checkMimeType(fileBuffer)
            return {ext, mime, fileBuffer}
        })
    }

    /**
     * 检查mimetype
     * @param mimeType
     */
    _checkMimeType(fileBuffer) {
        const {ext, mime} = fileType(fileBuffer)
        if (!/^image\/(png|gif|jpeg)$/i.test(mime) || !/^(png|gif|jpg)$/i.test(ext)) {
            throw Object.assign(new Error("当前头像不是系统所支持的图片格式"), {data: {ext, mime}})
        }
        if (fileBuffer.length > 14385152) {
            throw Object.assign(new Error("头像最大支持2MB"), {data: {fileSize: fileBuffer.length}})
        }
        return {ext, mime}
    }
}
