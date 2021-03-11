import { Dictionary } from "./dictionary";

export interface ResultCondition {
    type: ResultConditionType;
    checkCondition(data: Dictionary<string>): boolean;
    interpolate(data: Dictionary<string>): void;
}

export enum ResultConditionType {
    Equal = "equal",
    NotEqual = "notequal"
}