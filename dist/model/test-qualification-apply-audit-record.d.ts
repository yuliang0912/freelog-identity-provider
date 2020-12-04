import { MongooseModelBase } from 'egg-freelog-base/database/mongoose-model-base';
export declare class TestQualificationApplyAuditRecordModel extends MongooseModelBase {
    constructor(mongoose: any);
    buildMongooseModel(): any;
    static toObjectOptions(): {
        transform: (doc: any, ret: any, options: any) => {
            recordId: any;
        } & Pick<any, string | number | symbol>;
    };
}
