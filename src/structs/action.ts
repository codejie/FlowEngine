import { BaseStruct } from "./base";

interface ActionAttribute {

}

interface ActionStyle {

}

interface ActionPermission {

}

export interface ActionType extends BaseStruct {
    type: number,
    attributes: ActionAttribute[],
    style: ActionStyle,
    permission: ActionPermission
}