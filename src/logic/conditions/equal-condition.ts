import { Dictionary } from "../../models/dictionary";
import { ResultCondition, ResultConditionType } from "../../models/result-condition";
import { InterpolationHelper } from "../helpers/interpolation.helper";

export class EqualResultCondition implements ResultCondition {
    public type: ResultConditionType = ResultConditionType.Equal;
    public conditionOne: any;
    public conditionTwo: any;
    public convertToString: boolean = true;

    constructor(conditionOne: any = null, conditionTwo: any = null, convertToString: boolean = true, instanceData?: EqualResultCondition) {
        this.conditionOne = conditionOne;
        this.conditionTwo = conditionTwo;
        this.convertToString = convertToString;

        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: EqualResultCondition) {
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

        this.conditionOne = interpolationHelper.interpolateInput(this.conditionOne, data);
        this.conditionTwo = interpolationHelper.interpolateInput(this.conditionTwo, data);
    }

    checkCondition(data: Dictionary<string>): boolean {
        let shallowClone: EqualResultCondition = <EqualResultCondition>Object.assign(new EqualResultCondition(), this);
        shallowClone.interpolate(data);

        if (shallowClone.convertToString) {
            let conditionOneString: string = String(shallowClone.conditionOne);
            let conditionTwoString: string = String(shallowClone.conditionTwo);
            return conditionOneString === conditionTwoString;
        } else {
            return shallowClone.conditionOne === shallowClone.conditionTwo;
        }
    }
}