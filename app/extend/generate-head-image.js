'use strict'

const lodash = require('lodash')
const identicon = require('identicon.js')
const cryptoHelper = require('egg-freelog-base/app/extend/helper/crypto_helper')
const headImageSchemes = {
    scheme_1: {
        foreground: [0, 0, 220, 255],
        background: [255, 255, 255, 255],
        margin: 0.2,
        size: 200,
        format: 'PNG'
    },
    scheme_2: {
        foreground: [0, 245, 245, 245],
        background: [255, 255, 255, 255],
        margin: 0.2,
        size: 200,
        format: 'PNG'
    },
    scheme_3: {
        foreground: [0, 235, 0, 255],
        background: [255, 255, 255, 255],
        margin: 0.2,
        size: 200,
        format: 'PNG'
    }
}

module.exports = class GenerateHeadImage {

    /**
     * 生成头像
     */
    generateHeadImage(key, schemeId) {
        const options = this._getGenerateScheme(schemeId)
        const hash = cryptoHelper.sha512(lodash.isString(key) ? key : Math.random().toString())
        return new identicon(hash, options).toString()
    }

    /***
     * 获取配色方案
     * @param schemeId
     * @returns {*}
     * @private
     */
    _getGenerateScheme(schemeId) {
        if (![1, 2, 3].includes(schemeId)) {
            schemeId = lodash.random(1, 3)
        }
        return headImageSchemes[`scheme_${schemeId}`]
    }
}

