import { Dictionary } from "../../models/dictionary";
import { IntervalCheck, IntervalCheckAction, IntervalCheckActionType } from "../../models/interval-check";
import { InterpolationHelper } from "../helpers/interpolation.helper";
import * as notifier from 'node-notifier';

export class NotificationAction implements IntervalCheckAction {
    actionType: IntervalCheckActionType = IntervalCheckActionType.Notification;

    title: string = "";
    message: string = "";

    constructor(instanceData?: NotificationAction) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: NotificationAction) {
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

        this.title = interpolationHelper.interpolateInput(this.title, data);
        this.message = interpolationHelper.interpolateInput(this.message, data);
    }


    run(interval: IntervalCheck, data: Dictionary<string>): Promise<void> {
        let currentNotificationAction: NotificationAction = this;
        return new Promise<void>((resolve : () => void, reject : () => void) => {
            let shallowCopy: NotificationAction = <NotificationAction>Object.assign(new NotificationAction(), currentNotificationAction);
            shallowCopy.interpolate(data);
            
            notifier.notify({
                title: shallowCopy.title,
                message: shallowCopy.message,
                sound: true
            });
        });
    }

}