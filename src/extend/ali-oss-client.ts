const aliOss = require('ali-oss');
import {Stream} from 'stream';
import {IObjectStorageService} from 'egg-freelog-base';
import {IApplicationContext, providerWrapper, scope, ScopeEnum} from 'midway';

@scope(ScopeEnum.Prototype)
export class AliOssClient implements IObjectStorageService {

    client: any;
    serverProvider: 'aliOss';

    constructor(config: object) {
        const wrapper = aliOss.Wrapper || aliOss;
        this.client = new wrapper(config);
    }

    /**
     * 复制对象
     * @param toObjectName
     * @param fromObjectName
     * @param options
     */
    copyObject(toObjectName: string, fromObjectName: string, options?: object): Promise<any> {
        return this.client.copy(toObjectName, fromObjectName, options);
    }

    /**
     * 删除对象
     * @param objectName 对象名,存在路径就用/分隔
     */
    deleteObject(objectName: string): Promise<any> {
        return this.client.delete(objectName);
    }

    /**
     * 获取文件流
     * @param objectName 对象名,存在路径就用/分隔
     */
    getStream(objectName: string): Promise<any> {
        return this.client.getStream(objectName);
    }

    /**
     * 以buffer的形式写入文件
     * @param objectName 对象名,存在路径就用/分隔
     * @param fileBuffer 文件buffer
     * @param options
     */
    putBuffer(objectName: string, fileBuffer: Buffer, options?: object): Promise<any> {
        return this.client.put(objectName, fileBuffer, options);
    }

    /**
     * 以流的形式写入文件
     * @param objectName 对象名,存在路径就用/分隔
     * @param fileStream 文件流,一般指可读流
     * @param options
     */
    putStream(objectName: string, fileStream: Stream, options?: object): Promise<any> {
        return this.client.putStream(objectName, fileStream, options);
    }
}

export function aliOssClient(_context: IApplicationContext) {
    return (config: object): IObjectStorageService => {
        return new AliOssClient(config);
    };
}

providerWrapper([{
    id: 'aliOssClientFactory',
    provider: aliOssClient,
}]);
