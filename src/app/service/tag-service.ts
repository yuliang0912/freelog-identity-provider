import {findOptions, ITageService, TagInfo} from '../../interface';
import {inject, provide} from 'midway';
import TagInfoProvider from '../data-provider/tag-provider';
import {PageResult} from 'egg-freelog-base';
import AutoIncrementRecordProvider from '../data-provider/auto-increment-record-provider';

@provide()
export class TagService implements ITageService {

    @inject()
    tagInfoProvider: TagInfoProvider;
    @inject()
    autoIncrementRecordProvider: AutoIncrementRecordProvider;

    /**
     * 创建tag
     * @param createTags
     * @param type
     * @param updateTagIds
     */
    async create(createTags: string[], type: 1 | 2, updateTagIds: number[]): Promise<TagInfo[]> {

        const tagLists: any[] = [];
        for (const tag of createTags) {
            tagLists.push({tag, type, status: 0, _id: await this.autoIncrementRecordProvider.getNextTagId()});
        }
        if (updateTagIds?.length) {
            await this.tagInfoProvider.updateMany({_id: {$in: updateTagIds}}, {status: 0});
        }

        await this.tagInfoProvider.insertMany(tagLists);

        return this.tagInfoProvider.find({_id: {$in: [...tagLists.map(x => x._id), ...updateTagIds]}});
    }

    /**
     * 查询多条
     * @param condition
     * @param options
     */
    async find(condition: object, options?: findOptions<TagInfo>): Promise<TagInfo[]> {
        return this.tagInfoProvider.find(condition, options?.projection, options);
    }

    /**
     * 查询单条
     * @param condition
     * @param options
     */
    async findOne(condition: object, options?: findOptions<TagInfo>): Promise<TagInfo> {
        return this.tagInfoProvider.findOne(condition, options?.projection, options);
    }

    /**
     * 更新tag
     * @param tagInfo
     * @param model
     */
    async updateOne(tagInfo: TagInfo, model: object): Promise<boolean> {
        return this.tagInfoProvider.updateOne({_id: tagInfo.tagId}, model).then(t => Boolean(t.nModified));
    }

    /**
     * 批量更新
     * @param condition
     * @param model
     */
    async updateMany(condition: object, model: object): Promise<boolean> {
        return this.tagInfoProvider.updateMany(condition, model).then(t => Boolean(t.nModified));
    }

    /**
     * 查询区间列表
     * @param condition
     * @param options
     */
    async findIntervalList(condition: object, options?: findOptions<TagInfo>): Promise<PageResult<TagInfo>> {
        return this.tagInfoProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }

    /**
     * 数量统计
     * @param condition
     */
    async count(condition: object): Promise<number> {
        return this.tagInfoProvider.count(condition);
    }

    /**
     * 设置标签自增(自减)数量.
     * @param tagInfo
     * @param number
     */
    async setTagAutoIncrementCount(tagInfo: TagInfo, number: number): Promise<boolean> {
        return this.tagInfoProvider.updateOne({_id: tagInfo.tagId}, {$inc: {totalSetCount: number}}).then(x => Boolean(x.nModified));
    }

    /**
     * 设置标签自增(自减)数量.
     * @param tagIds
     * @param number
     */
    async setTagAutoIncrementCounts(tagIds: number[], number: 1 | -1): Promise<boolean> {
        return this.tagInfoProvider.updateMany({_id: {$in: tagIds}}, {$inc: {totalSetCount: number}}).then(x => Boolean(x.nModified));
    }
}
