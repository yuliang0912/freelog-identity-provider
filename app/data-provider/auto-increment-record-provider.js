'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class AutoIncrementRecordProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.AutoIncrementRecord)
    }

    /**
     * 获取下一个递增值
     * @param dataType
     * @returns {Promise<void>}
     */
    async getNextDateValue(dataType = 'USER_ID') {
        return super.findOneAndUpdate({dataType}, {$inc: {value: 1}}, {new: true}).then(model => {
            return model || super.create({dataType, value: 1})
        }).then(data => data.value)
    }
}