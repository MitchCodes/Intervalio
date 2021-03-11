import { Dictionary } from "./dictionary";

export class IntervalCheck {
    name: string = "Interval";
    enabled: boolean = true;
    intervalSeconds: number = 30;
    intervalFirstDelay: number = 0;
    methods: IntervalCheckMethod[] = [];
    actions: IntervalCheckAction[] = [];
    failActions: IntervalCheckAction[] = [];
    variables: Dictionary<string> = {};

    constructor(instanceData?: IntervalCheck) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    protected deserialize(instanceData: IntervalCheck) {
        // Note this.active will not be listed in keys since it's declared, but not defined
        const keys = Object.keys(this);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
            this[key] = instanceData[key];
            }
        }
    }
}

export interface IntervalCheckMethod {
    methodType: IntervalCheckMethodType;
    run(interval: IntervalCheck, data: Dictionary<string>): Promise<boolean>;
}

export enum IntervalCheckMethodType {
    ApiCall = "api-call"
}

export interface IntervalCheckAction {
    actionType: IntervalCheckActionType;
    run(interval: IntervalCheck, data: Dictionary<string>): Promise<void>;
}

export enum IntervalCheckActionType {
    Notification = "notification",
    Log = "log"
}