import { fstat } from "fs";
import { Logger } from "winston";
import { IntervalCheck } from "../models/interval-check";
import { ApiCallIntervalMethod, ApiHttpMethod, ApiHttpResponseType } from "./interval-methods/api-call-method";
import { writeFile } from 'fs';
import { EqualResultCondition } from "./conditions/equal-condition";
import { NotificationAction } from "./interval-actions/notification-action";
import { LogAction } from "./interval-actions/log-action";

export class ExampleGenerator {
    public generateExamples(log: Logger, intervalChecksFolder: string): void {
        let exampleApiMethod: ApiCallIntervalMethod = new ApiCallIntervalMethod();
        exampleApiMethod.httpUrl = "https://api.weather.gov/";
        exampleApiMethod.httpMethod = ApiHttpMethod.Get;
        exampleApiMethod.httpHeaders = {};
        exampleApiMethod.resultVariable = "api";
        exampleApiMethod.httpResponseType = ApiHttpResponseType.Json;
        exampleApiMethod.conditions = [
            new EqualResultCondition("{{api.status}}", "OK")
        ];

        let exampleNotificationAction: NotificationAction = new NotificationAction();
        exampleNotificationAction.title = "Weather API";
        exampleNotificationAction.message = "API lookin' good captain!";

        let exampleSuccessLogAction: LogAction = new LogAction();
        exampleSuccessLogAction.message = "The weather API looks good.";

        let exampleFailLogAction: LogAction = new LogAction();
        exampleFailLogAction.message = "The weather API is not looking good.";

        let exampleApiIntervalCheck: IntervalCheck = new IntervalCheck();
        exampleApiIntervalCheck.name = "example api check";
        exampleApiIntervalCheck.methods = [exampleApiMethod];
        exampleApiIntervalCheck.actions = [exampleNotificationAction, exampleSuccessLogAction];
        exampleApiIntervalCheck.failActions = [exampleFailLogAction];
        exampleApiIntervalCheck.enabled = false;
        exampleApiIntervalCheck.intervalSeconds = 15;
        
        let generatedApiCheck: string = JSON.stringify(exampleApiIntervalCheck, null, 2);
        //log.debug(generatedApiCheck);

        writeFile("./interval-checks/examples/example-api.json", generatedApiCheck, (err) => {
            if (err) throw err;
            log.debug("The api example has been generated");
        });
    }
}