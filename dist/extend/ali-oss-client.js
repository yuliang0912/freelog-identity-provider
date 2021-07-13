"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliOssClient = exports.AliOssClient = void 0;
const aliOss = require('ali-oss');
const midway_1 = require("midway");
let AliOssClient = class AliOssClient {
    client;
    serverProvider;
    constructor(config) {
        const wrapper = aliOss.Wrapper || aliOss;
        this.client = new wrapper(config);
    }
    /**
     * 复制对象
     * @param toObjectName
     * @param fromObjectName
     * @param options
     */
    copyObject(toObjectName, fromObjectName, options) {
        return this.client.copy(toObjectName, fromObjectName, options);
    }
    /**
     * 删除对象
     * @param objectName 对象名,存在路径就用/分隔
     */
    deleteObject(objectName) {
        return this.client.delete(objectName);
    }
    /**
     * 获取文件流
     * @param objectName 对象名,存在路径就用/分隔
     */
    getStream(objectName) {
        return this.client.getStream(objectName);
    }
    /**
     * 以buffer的形式写入文件
     * @param objectName 对象名,存在路径就用/分隔
     * @param fileBuffer 文件buffer
     * @param options
     */
    putBuffer(objectName, fileBuffer, options) {
        return this.client.put(objectName, fileBuffer, options);
    }
    /**
     * 以流的形式写入文件
     * @param objectName 对象名,存在路径就用/分隔
     * @param fileStream 文件流,一般指可读流
     * @param options
     */
    putStream(objectName, fileStream, options) {
        return this.client.putStream(objectName, fileStream, options);
    }
};
AliOssClient = __decorate([
    midway_1.scope(midway_1.ScopeEnum.Prototype),
    __metadata("design:paramtypes", [Object])
], AliOssClient);
exports.AliOssClient = AliOssClient;
function aliOssClient(_context) {
    return (config) => {
        return new AliOssClient(config);
    };
}
exports.aliOssClient = aliOssClient;
midway_1.providerWrapper([{
        id: 'aliOssClientFactory',
        provider: aliOssClient,
    }]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpLW9zcy1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXh0ZW5kL2FsaS1vc3MtY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUdsQyxtQ0FBOEU7QUFHOUUsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBWTtJQUVyQixNQUFNLENBQU07SUFDWixjQUFjLENBQVc7SUFFekIsWUFBWSxNQUFjO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUFDLFlBQW9CLEVBQUUsY0FBc0IsRUFBRSxPQUFnQjtRQUNyRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7T0FHRztJQUNILFlBQVksQ0FBQyxVQUFrQjtRQUMzQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsVUFBa0I7UUFDeEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUMsVUFBa0IsRUFBRSxVQUFrQixFQUFFLE9BQWdCO1FBQzlELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUMsVUFBa0IsRUFBRSxVQUFrQixFQUFFLE9BQWdCO1FBQzlELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0osQ0FBQTtBQXZEWSxZQUFZO0lBRHhCLGNBQUssQ0FBQyxrQkFBUyxDQUFDLFNBQVMsQ0FBQzs7R0FDZCxZQUFZLENBdUR4QjtBQXZEWSxvQ0FBWTtBQXlEekIsU0FBZ0IsWUFBWSxDQUFDLFFBQTZCO0lBQ3RELE9BQU8sQ0FBQyxNQUFjLEVBQXlCLEVBQUU7UUFDN0MsT0FBTyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBSkQsb0NBSUM7QUFFRCx3QkFBZSxDQUFDLENBQUM7UUFDYixFQUFFLEVBQUUscUJBQXFCO1FBQ3pCLFFBQVEsRUFBRSxZQUFZO0tBQ3pCLENBQUMsQ0FBQyxDQUFDIn0=