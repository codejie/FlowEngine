import { BaseType } from "../base";
import { NodeType } from "../nodes/node";

interface ActionAttribute {

}

interface ActionStyle {

}

interface ActionPermission {

}

export abstract class ActionType extends BaseType {
    public type: number;
    attributes: ActionAttribute[] = [];
    style: ActionStyle = {};
    permission: ActionPermission = {};

    constructor(id: string, type: number = 0, name?: string, description?: string) {
        super(id, name, description);
        this.type = type;
    }

    public onPrevNode(node: NodeType): boolean {
        return true;
    }

    public onNextNode(node: NodeType): boolean {
        return true;
    }
}