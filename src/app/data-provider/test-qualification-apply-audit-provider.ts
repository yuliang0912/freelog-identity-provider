import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'
import {TestQualificationApplyAuditRecordInfo} from '../../interface'

@provide()
@scope('Singleton')
export default class TestQualificationApplyAuditProvider extends MongodbOperation<TestQualificationApplyAuditRecordInfo> {

    constructor(@inject('model.testQualificationApplyAuditRecord') model) {
        super(model);
    }
}
