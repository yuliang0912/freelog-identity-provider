import { OutsideApiService } from './outside-api-service';
import { MongodbOperation } from 'egg-freelog-base';
import { ThirdPartyIdentityInfo } from '../../interface';
export declare class ThirdPartyIdentityService {
    outsideApiService: OutsideApiService;
    thirdPartyIdentityProvider: MongodbOperation<ThirdPartyIdentityInfo>;
    setChatToken(code: string): Promise<ThirdPartyIdentityInfo>;
}
