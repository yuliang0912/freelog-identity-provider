export = AppBootHook;
declare class AppBootHook {
    constructor(app: any);
    app: any;
    willReady(): Promise<void>;
    decodeOssConfig(): void;
}
