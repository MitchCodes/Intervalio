export class IntervalCheck {
    name: string = "Interval";
    enabled: boolean = true;
    methods: IntervalCheckMethod[] = [];
    actions: IntervalCheckAction[] = [];

    constructor(instanceData?: IntervalCheck) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: IntervalCheck) {
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
    intervalSeconds: number;
    run(interval: IntervalCheck): boolean;
}

export enum IntervalCheckMethodType {
    ApiCall = "api-call"
}

export interface IntervalCheckAction {
    actionType: IntervalCheckActionType;
    run(interval: IntervalCheck): void;
}

export enum IntervalCheckActionType {
    Sound = "sound",
    Notification = "notification"
}