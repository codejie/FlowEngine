import { BaseStruct } from "./base";

interface NodeAttribute {

}

interface NodeStyle {

}

interface NodePermission {

}

export interface NodeStruct extends BaseStruct {
    type: number,
    attributes: NodeAttribute[],
    style: NodeStyle,
    permission: NodePermission
}