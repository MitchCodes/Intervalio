import { IntervalCheckAction, IntervalCheckActionType, IntervalCheckMethod, IntervalCheckMethodType } from "../../models/interval-check";

export class IntervalActionFactory { 
    public buildIntervalAction(checkAction: IntervalCheckAction): IntervalCheckAction {
        let returnIntervalAction: IntervalCheckAction = null;

        switch (checkAction.actionType) {
            case IntervalCheckActionType.Notification:
                break;
            case IntervalCheckActionType.Sound:
                break;
        }

        return returnIntervalAction;
    }
}
