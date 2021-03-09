import { IntervalCheck, IntervalCheckAction, IntervalCheckMethod } from "../models/interval-check";
import { IntervalActionFactory } from "./interval-actions/action-factory";
import { IntervalMethodFactory } from "./interval-methods/method-factory";

export class IntervalFactory {
    public buildIntervalCheck(json: string): IntervalCheck {
        let methodFactory: IntervalMethodFactory = new IntervalMethodFactory();
        let actionFactory: IntervalActionFactory = new IntervalActionFactory();

        let basicParse: IntervalCheck = <IntervalCheck>JSON.parse(json);
        let returnParse: IntervalCheck = new IntervalCheck(<IntervalCheck>JSON.parse(json));

        returnParse.methods = [];
        for (let method of basicParse.methods) {
            let builtIntervalMethod: IntervalCheckMethod = methodFactory.buildIntervalMethod(method);
            returnParse.methods.push(builtIntervalMethod);
        }
        
        returnParse.actions = [];
        for (let action of basicParse.actions) {
            let builtIntervalAction: IntervalCheckAction = actionFactory.buildIntervalAction(action);
            returnParse.actions.push(builtIntervalAction);
        }

        return returnParse;
    }
}