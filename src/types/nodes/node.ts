import { BaseType } from "../base";
import { ActionType } from "../actions/action";

interface NodeAttribute {

}

interface NodeStyle {

}

interface NodePermission {

}

export abstract class NodeType extends BaseType {
    public type: number;
    public attributes: NodeAttribute[] = []
    public style: NodeStyle = {}
    public permission: NodePermission = {}

    constructor(id: string, type: number = 0, name?: string, description?: string) {
        super(id, name, description);
        this.type = type;
    }

    public onNextAction(actionId: string): Promise<any> | Promise<undefined> {
        return Promise.resolve(undefined);
    }

    public onPrevAction(actionId: string, data?: any): Promise<void> {
        return Promise.resolve();
    }

    // public abstract save(): void;
    // public abstract load(): void;
}