import { IntervalCheck, IntervalCheckMethod, IntervalCheckMethodType } from "../../models/interval-check";
import * as axiosImport from 'axios';
import { AxiosStatic } from "axios";
import { Dictionary } from "../../models/dictionary";
import { ResultCondition } from "../../models/result-condition";
import { InterpolationHelper } from "../helpers/interpolation.helper";
import { ConditionFactory } from "../conditions/condition-factory";
import { Logger } from "winston";

export class ApiCallIntervalMethod implements IntervalCheckMethod {
    methodType: IntervalCheckMethodType = IntervalCheckMethodType.ApiCall;

    httpMethod: ApiHttpMethod = ApiHttpMethod.Get;
    httpUrl: string = "";
    httpHeaders: Dictionary<string> = {};
    httpResponseType: ApiHttpResponseType = ApiHttpResponseType.Json;
    httpRequestBody: any = {};
    resultVariable: string = "api";
    onlyNewlyTriggered: boolean = false;

    previouslyTriggered: boolean = false;

    conditions: ResultCondition[] = [];

    logger: Logger;

    constructor(instanceData?: ApiCallIntervalMethod, logger?: Logger) {
        if (instanceData) {
            this.deserialize(instanceData);

            let conditionFactory: ConditionFactory = new ConditionFactory();
            let newConditions: ResultCondition[] = [];
            for (let condition of instanceData.conditions) {
                newConditions.push(conditionFactory.buildCondition(condition));
            }

            this.conditions = newConditions;
        }

        if (logger) {
            this.logger = logger;
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

    run(interval: IntervalCheck, data: Dictionary<string>): Promise<boolean> {
        let httpHeaders: Dictionary<string> = this.httpHeaders;
        return new Promise<boolean>((resolve : (val: boolean) => void, reject : (val: boolean) => void) => {
            let axios: AxiosStatic = axiosImport.default;
            let currentInterval: IntervalCheck = interval;
            let response: any = axios.request({
                url: this.httpUrl,
                method: this.httpMethod,
                data: JSON.stringify(this.httpRequestBody),
                transformRequest: [function (requestData, headers) {
                    let interpolateHelper: InterpolationHelper = new InterpolationHelper();
                    let shallowClonedHeaders: Dictionary<string> = <Dictionary<string>>Object.assign({}, httpHeaders);
                    let headersKeys: string[] = Object.keys(shallowClonedHeaders);
                    for (let headerKey of headersKeys) {
                        let headerValue: string = shallowClonedHeaders[headerKey];
                        let interpolatedKey: string = interpolateHelper.interpolateInput(headerKey, data);
                        let interpolatedValue: string = interpolateHelper.interpolateInput(headerValue, data);
                        headers.common[interpolatedKey] = interpolatedValue;
                    }
                    return requestData;
                }]
            });

            response.then((result: axiosImport.AxiosResponse<any>) => {
                if (result.status === 200) {
                    if (result.data !== undefined && result.data !== null) {
                        this.populateDataFromApiResult(result, data);

                        let anyConditionMet: boolean = false;
                        for (let condition of this.conditions) {
                            let conditionMet: boolean = condition.checkCondition(data);
                            if (conditionMet) {
                                anyConditionMet = true;
                                break;
                            }
                        }

                        if (this.onlyNewlyTriggered) {
                            if (anyConditionMet && !this.previouslyTriggered) {
                                this.previouslyTriggered = anyConditionMet;
                                resolve(true);
                            } else {
                                this.previouslyTriggered = anyConditionMet;
                                resolve(false);
                            }
                        } else {
                            this.previouslyTriggered = anyConditionMet;
                            resolve(anyConditionMet);
                        }
                    }
                } else {
                    resolve(false);
                }
            }).catch((error: any) => {
                if (this.logger) {
                    this.logger.error(error);
                }
                resolve(false);
            });
        });
    }

    private populateDataFromApiResult(result: axiosImport.AxiosResponse<any>, dataDictionary: Dictionary<string>) {
        switch (this.httpResponseType) {
            case ApiHttpResponseType.Json:
                this.populateDataFromJsonApiResult(result, dataDictionary);
                break;
        }
    }

    private populateDataFromJsonApiResult(result: axiosImport.AxiosResponse<any>, dataDictionary: Dictionary<string>) {
        dataDictionary[this.resultVariable] = JSON.stringify(result.data);

        let currentDataPath: string = this.resultVariable;
        
        this.handleJsonDataObject(result.data, currentDataPath, result, dataDictionary);
    }

    private handleJsonDataObject(dataObject: any, inputPath: string, result: axiosImport.AxiosResponse<any>, dataDictionary: Dictionary<string>) {
        let dataKeys: string[] = Object.keys(dataObject);
        for (let dataKey of dataKeys) {
            let dataValue: any = dataObject[dataKey];
            let currentPath: string = inputPath + '.' + dataKey;
            if (this.isObject(dataValue)) {
                this.handleJsonDataObject(dataValue, currentPath, result, dataDictionary);
            } else if (this.isArray(dataValue)) {
                this.handleJsonDataArray(dataValue, currentPath, result, dataDictionary);
            } else {
                dataDictionary[currentPath] = dataValue;
            }
        }
    }

    private handleJsonDataArray(dataArray: any, inputPath: string, result: axiosImport.AxiosResponse<any>, dataDictionary: Dictionary<string>) {
        for (let i = 0; i < dataArray.length ; i++) {
            let currentElement: any = dataArray[i];
            let currentPath: string = inputPath + '[' + i + ']'
            this.handleJsonDataObject(currentElement, currentPath, result, dataDictionary);
        }
    }

    private isObject(input: any): boolean {
        return typeof input === 'object' && input !== null;
    }

    private isArray(input: any): boolean {
        return input !== null && Array.isArray(input);
    }
}

export enum ApiHttpMethod {
    Get = "get",
    Post = "post"
}

export enum ApiHttpResponseType {
    Json = "json"
}