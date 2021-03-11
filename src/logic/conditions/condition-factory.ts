import { ResultCondition, ResultConditionType } from "../../models/result-condition";
import { EqualResultCondition } from "./equal-condition";
import { NotEqualResultCondition } from "./not-equal-condition";

export class ConditionFactory {
    public buildCondition(condition: ResultCondition): ResultCondition {
        let returnCondition: ResultCondition = null;

        switch (condition.type) {
            case ResultConditionType.Equal:
                returnCondition = new EqualResultCondition(null, null, true, <EqualResultCondition>condition);
                break;
            case ResultConditionType.NotEqual:
                returnCondition = new NotEqualResultCondition(null, null, true, <NotEqualResultCondition>condition);
                break;
        }

        return returnCondition;
    }
}