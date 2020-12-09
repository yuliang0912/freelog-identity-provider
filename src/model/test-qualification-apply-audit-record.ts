import {omit} from 'lodash'
import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.testQualificationApplyAuditRecord')
export class TestQualificationApplyAuditRecordModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const otherInfoSchema = new this.mongoose.Schema({
            province: {type: String, required: true},
            city: {type: String, required: true},
            occupation: {type: String, required: true}, //职业
            description: {type: String, required: true},
        }, {_id: false})

        const TestQualificationApplyAuditRecordSchema = new this.mongoose.Schema({
            userId: {type: Number, required: true},
            username: {type: String, required: true},
            otherInfo: {type: otherInfoSchema, required: true},
            auditMsg: {type: String, default: '', required: false}, //错误信息
            operationUserId: {type: Number, default: 0, required: true}, //审核人ID
            status: {type: Number, default: 0, required: true} // 0:待审核 1:审核通过 2:审核不通过
        }, {
            versionKey: false,
            toJSON: TestQualificationApplyAuditRecordModel.toObjectOptions,
            toObject: TestQualificationApplyAuditRecordModel.toObjectOptions,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
        })

        TestQualificationApplyAuditRecordSchema.virtual('id').get(function (this: any) {
            return this._id;
        });

        return this.mongoose.model('test-qualification-apply-audit-records', TestQualificationApplyAuditRecordSchema)
    }

    static get toObjectOptions() {
        return {
            transform: function (doc, ret, options) {
                const otherInfo = ret.otherInfo;
                return Object.assign({recordId: doc.id}, otherInfo, omit(ret, ['_id', 'otherInfo']))
            }
        }
    }
}
