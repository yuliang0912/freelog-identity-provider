/**
 * Created by yuliang on 2017/6/30.
 */

'use strict'

module.exports = async (app) => {

    app.on('error', (err, ctx) => {
        if (!err || !ctx) {
            return
        }

        ctx.body = ctx.buildReturnObject(app.retCodeEnum.serverError,
            app.errCodeEnum.autoSnapError,
            err.message || err.toString())
    })
}

