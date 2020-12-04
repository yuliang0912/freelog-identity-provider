'use strict';
const cryptoHelper = require('egg-freelog-base/app/extend/helper/crypto_helper');
module.exports = class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    async willReady() {
        this.decodeOssConfig();
    }
    decodeOssConfig() {
        let { aliOss } = this.app.config.uploadConfig;
        if (aliOss.isCryptographic) {
            aliOss.accessKeyId = cryptoHelper.base64Decode(aliOss.accessKeyId);
            aliOss.accessKeySecret = cryptoHelper.base64Decode(aliOss.accessKeySecret);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTtBQUVaLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO0FBRWhGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxXQUFXO0lBRTlCLFlBQVksR0FBRztRQUNYLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUztRQUNYLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUMxQixDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksRUFBQyxNQUFNLEVBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUE7UUFDM0MsSUFBSSxNQUFNLENBQUMsZUFBZSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDbEUsTUFBTSxDQUFDLGVBQWUsR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTtTQUM3RTtJQUNMLENBQUM7Q0FDSixDQUFBIn0=