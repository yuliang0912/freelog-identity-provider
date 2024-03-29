import { findOptions, ITageService, TagInfo } from '../../interface';
import TagInfoProvider from '../data-provider/tag-provider';
import { PageResult } from 'egg-freelog-base';
import AutoIncrementRecordProvider from '../data-provider/auto-increment-record-provider';
export declare class TagService implements ITageService {
    tagInfoProvider: TagInfoProvider;
    autoIncrementRecordProvider: AutoIncrementRecordProvider;
    /**
     * 创建tag
     * @param createTags
     * @param type
     * @param updateTagIds
     */
    create(createTags: string[], type: 1 | 2, updateTagIds: number[]): Promise<TagInfo[]>;
    /**
     * 查询多条
     * @param condition
     * @param options
     */
    find(condition: object, options?: findOptions<TagInfo>): Promise<TagInfo[]>;
    /**
     * 查询单条
     * @param condition
     * @param options
     */
    findOne(condition: object, options?: findOptions<TagInfo>): Promise<TagInfo>;
    /**
     * 更新tag
     * @param tagInfo
     * @param model
     */
    updateOne(tagInfo: TagInfo, model: object): Promise<boolean>;
    /**
     * 批量更新
     * @param condition
     * @param model
     */
    updateMany(condition: object, model: object): Promise<boolean>;
    /**
     * 查询区间列表
     * @param condition
     * @param options
     */
    findIntervalList(condition: object, options?: findOptions<TagInfo>): Promise<PageResult<TagInfo>>;
    /**
     * 数量统计
     * @param condition
     */
    count(condition: object): Promise<number>;
    /**
     * 设置标签自增(自减)数量.
     * @param tagInfo
     * @param number
     */
    setTagAutoIncrementCount(tagInfo: TagInfo, number: number): Promise<boolean>;
    /**
     * 设置标签自增(自减)数量.
     * @param tagIds
     * @param number
     */
    setTagAutoIncrementCounts(tagIds: number[], number: 1 | -1): Promise<boolean>;
}
