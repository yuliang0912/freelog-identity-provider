const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class MessageRecordProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.MessageRecord)
    }

}