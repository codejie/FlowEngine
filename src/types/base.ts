export enum OnActionState {
    DISMISS = 0,
    KEEP = 1
}

export type ActionData = any;

export interface ActionResult {
    state: OnActionState,
    data: ActionData
}

export abstract class BaseType {
    public id: string;
    public name?: string;
    public description?: string;

    constructor (id: string, name?: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}