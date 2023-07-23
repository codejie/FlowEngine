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

    public onPrevAction(action: ActionType): boolean {
        return true;
    }

    public onNextAction(action: ActionType): boolean {
        return true;
    }

    // public abstract save(): void;
    // public abstract load(): void;
}