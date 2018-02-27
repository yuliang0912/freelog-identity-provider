'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class GroupProvider extends MongoBaseOperation {
    constructor(app) {
        super(app.model.Group)
        this.app = app
    }
}