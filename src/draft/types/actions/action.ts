import { BaseType } from "../base";
import { NodeType } from "../nodes/node";

export enum ActionMode {
    NORMAL = 0,
    AUTO = 1,
    DELAY = 2
}

interface ActionAttribute {

}

interface ActionStyle {

}

interface ActionPermission {

}

export abstract class ActionType extends BaseType {
    mode: ActionMode = ActionMode.NORMAL;
    attributes: ActionAttribute[] = [];
    style: ActionStyle = {};
    permission: ActionPermission = {};

    constructor(id: string, name?: string, description?: string) {
        super(id, name, description);
    }

    public onPrevNode(node: NodeType): boolean {
        return true;
    }

    public onNextNode(node: NodeType): boolean {
        return true;
    }
}