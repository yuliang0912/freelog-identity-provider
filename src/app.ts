import mongoose from 'egg-freelog-base/database/mongoose';


const exportInfo = module.exports;

export default class AppBootHook {
    private readonly app;

    public constructor(app) {
        this.app = app;
        exportInfo.app = app;
    }

    async willReady() {
        return mongoose(this.app).then(() => {
            return this.app.applicationContext.getAsync('kafkaStartup');
        });
    }
}
