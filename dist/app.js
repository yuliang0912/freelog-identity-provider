"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("egg-freelog-base/database/mongoose");
const exportInfo = module.exports;
class AppBootHook {
    app;
    constructor(app) {
        this.app = app;
        exportInfo.app = app;
    }
    async willReady() {
        return (0, mongoose_1.default)(this.app).then(() => {
            return this.app.applicationContext.getAsync('kafkaStartup');
        });
    }
}
exports.default = AppBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlFQUEwRDtBQUcxRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBRWxDLE1BQXFCLFdBQVc7SUFDWCxHQUFHLENBQUM7SUFFckIsWUFBbUIsR0FBRztRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUztRQUNYLE9BQU8sSUFBQSxrQkFBUSxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFiRCw4QkFhQyJ9