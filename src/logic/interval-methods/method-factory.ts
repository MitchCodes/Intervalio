import { Logger } from "winston";
import { IntervalCheckMethod, IntervalCheckMethodType } from "../../models/interval-check";
import { ApiCallIntervalMethod } from "./api-call-method";

export class IntervalMethodFactory { 
    public buildIntervalMethod(checkMethod: IntervalCheckMethod, logger: Logger): IntervalCheckMethod {
        let returnIntervalMethod: IntervalCheckMethod = null;

        switch (checkMethod.methodType) {
            case IntervalCheckMethodType.ApiCall:
                returnIntervalMethod = new ApiCallIntervalMethod(<ApiCallIntervalMethod>checkMethod);
                break;
        }

        return returnIntervalMethod;
    }
}
