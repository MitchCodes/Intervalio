import { Logger } from "winston";
import { Dictionary } from "../../models/dictionary";
import { IntervalCheck, IntervalCheckAction, IntervalCheckActionType } from "../../models/interval-check";
import { InterpolationHelper } from "../helpers/interpolation.helper";

export class LogAction implements IntervalCheckAction {
    actionType: IntervalCheckActionType = IntervalCheckActionType.Log;

    message: string = "";
    logger: Logger;

    constructor(instanceData?: LogAction) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: LogAction) {
        // Note this.active will not be listed in keys since it's declared, but not defined
        const keys = Object.keys(this);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
            this[key] = instanceData[key];
            }
        }
    }

    interpolate(data: Dictionary<string>): void {
        let interpolationHelper: InterpolationHelper = new InterpolationHelper();

        this.message = interpolationHelper.interpolateInput(this.message, data);
    }


    run(interval: IntervalCheck, data: Dictionary<string>): Promise<void> {
        let currentLogAction: LogAction = this;
        return new Promise<void>((resolve : () => void, reject : () => void) => {
            let shallowCopy: LogAction = <LogAction>Object.assign(new LogAction(), currentLogAction);
            shallowCopy.interpolate(data);
            
            if (shallowCopy.logger !== undefined && shallowCopy.logger !== null) {
                shallowCopy.logger.info(shallowCopy.message);
            }
        });
    }

}