import { Dictionary } from "../models/dictionary";
import { IntervalCheck } from "../models/interval-check";

export class IntervalExecutor {
    public executeInterval(intervalCheck: IntervalCheck): Promise<void> {
        return new Promise<void>((resolve : () => void, reject : () => void) => {
            let intervalData: Dictionary<string> = {};
            let startingDataKeys: string[] = Object.keys(intervalCheck.variables);
            for (let startingDataKey of startingDataKeys) {
                intervalData[startingDataKey] = intervalCheck.variables[startingDataKey];
            }

            let methodPromises: Promise<boolean>[] = [];
            for (let intervalCheckMethod of intervalCheck.methods) {
                methodPromises.push(intervalCheckMethod.run(intervalCheck, intervalData));
            }

            Promise.all(methodPromises).then((values: boolean[]) => {
                let anyTrue: boolean = false;
                for (let value of values) {
                    if (value) {
                        anyTrue = true;
                        break;
                    }
                }

                if (anyTrue) {
                    let actionPromises: Promise<void>[] = [];
                    for (let action of intervalCheck.actions) {
                        actionPromises.push(action.run(intervalCheck, intervalData));
                    }

                    Promise.all(actionPromises).then(() => {
                        resolve();
                    });
                } else {
                    let failActionPromises: Promise<void>[] = [];
                    for (let action of intervalCheck.failActions) {
                        failActionPromises.push(action.run(intervalCheck, intervalData));
                    }

                    Promise.all(failActionPromises).then(() => {
                        resolve();
                    });
                }
            });            
        });
    }
}