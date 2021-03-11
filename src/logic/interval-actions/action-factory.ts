import { Logger } from "winston";
import { IntervalCheckAction, IntervalCheckActionType, IntervalCheckMethod, IntervalCheckMethodType } from "../../models/interval-check";
import { LogAction } from "./log-action";
import { NotificationAction } from "./notification-action";

export class IntervalActionFactory { 
    public buildIntervalAction(checkAction: IntervalCheckAction, logger: Logger): IntervalCheckAction {
        let returnIntervalAction: IntervalCheckAction = null;

        switch (checkAction.actionType) {
            case IntervalCheckActionType.Notification:
                returnIntervalAction = new NotificationAction(<NotificationAction>checkAction);
                break;
            case IntervalCheckActionType.Log:
                let newLogAction: LogAction = new LogAction(<LogAction>checkAction);
                newLogAction.logger = logger;
                returnIntervalAction = newLogAction;
                break;
        }

        return returnIntervalAction;
    }
}
