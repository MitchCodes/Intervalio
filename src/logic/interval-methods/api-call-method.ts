import { IntervalCheck, IntervalCheckMethod, IntervalCheckMethodType } from "../../models/interval-check";
import * as axiosImport from 'axios';
import { AxiosStatic } from "axios";
import { Dictionary } from "../../models/dictionary";

export class ApiCallIntervalMethod implements IntervalCheckMethod {
    methodType: IntervalCheckMethodType = IntervalCheckMethodType.ApiCall;
    intervalSeconds: number = 30;

    httpMethod: ApiHttpMethod = ApiHttpMethod.Get;
    httpUrl: string = "";
    httpHeaders: Dictionary<string>;

    conditions: string[];

    run(interval: IntervalCheck): boolean {
        let axios: AxiosStatic = axiosImport.default;
        let response: any = axios.request({
            url: this.httpUrl,
            method: this.httpMethod,
            transformRequest: [function (data, headers) {
                
                return data;
            }]
        });

        return false;
    }

    constructor(instanceData?: ApiCallIntervalMethod) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: ApiCallIntervalMethod) {
        // Note this.active will not be listed in keys since it's declared, but not defined
        const keys = Object.keys(this);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
            this[key] = instanceData[key];
            }
        }
    }
}

export enum ApiHttpMethod {
    Get = "get",
    Post = "post"
}