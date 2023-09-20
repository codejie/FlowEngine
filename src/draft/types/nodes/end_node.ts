import { ActionType } from "../actions/action";
import { NodeType } from "./node";

export default class EndNode extends NodeType {
    constructor() {
        super("NODE_END");
    }

    // public override onNextAction(action: ActionType): boolean {
    //     return false;
    // }
}