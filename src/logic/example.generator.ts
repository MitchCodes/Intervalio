import { fstat } from "fs";
import { Logger } from "winston";
import { IntervalCheck } from "../models/interval-check";
import { ApiCallIntervalMethod, ApiHttpMethod } from "./interval-methods/api-call-method";
import { writeFile } from 'fs';

export class ExampleGenerator {
    public generateExamples(log: Logger, intervalChecksFolder: string): void {
        let exampleApiMethod: ApiCallIntervalMethod = new ApiCallIntervalMethod();
        exampleApiMethod.httpUrl = "https://api.weather.gov/";
        exampleApiMethod.httpMethod = ApiHttpMethod.Get;
        exampleApiMethod.httpHeaders = {};
        exampleApiMethod.conditions = ["status='OK'"];

        let exampleApiIntervalCheck: IntervalCheck = new IntervalCheck();
        exampleApiIntervalCheck.name = "example api check";
        exampleApiIntervalCheck.methods = [exampleApiMethod];
        exampleApiIntervalCheck.actions = [];
        exampleApiIntervalCheck.enabled = false;
        
        let generatedApiCheck: string = JSON.stringify(exampleApiIntervalCheck, null, 2);
        //log.debug(generatedApiCheck);

        writeFile("./interval-checks/example-api.json", generatedApiCheck, (err) => {
            if (err) throw err;
            log.debug("The api example has been generated");
        });
    }
}