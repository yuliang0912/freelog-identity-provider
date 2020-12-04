/// <reference types="node" />
import { Stream } from 'stream';
import { IObjectStorageService } from 'egg-freelog-base';
import { IApplicationContext } from 'midway';
export declare class AliOssClient implements IObjectStorageService {
    client: any;
    serverProvider: 'aliOss';
    constructor(config: object);
    /**
     * 复制对象
     * @param toObjectName
     * @param fromObjectName
     * @param options
     */
    copyObject(toObjectName: string, fromObjectName: string, options?: object): Promise<any>;
    /**
     * 删除对象
     * @param objectName 对象名,存在路径就用/分隔
     */
    deleteObject(objectName: string): Promise<any>;
    /**
     * 获取文件流
     * @param objectName 对象名,存在路径就用/分隔
     */
    getStream(objectName: string): Promise<any>;
    /**
     * 以buffer的形式写入文件
     * @param objectName 对象名,存在路径就用/分隔
     * @param fileBuffer 文件buffer
     * @param options
     */
    putBuffer(objectName: string, fileBuffer: Buffer, options?: object): Promise<any>;
    /**
     * 以流的形式写入文件
     * @param objectName 对象名,存在路径就用/分隔
     * @param fileStream 文件流,一般指可读流
     * @param options
     */
    putStream(objectName: string, fileStream: Stream, options?: object): Promise<any>;
}
export declare function aliOssClient(_context: IApplicationContext): (config: object) => IObjectStorageService;
