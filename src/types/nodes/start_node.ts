import { ActionType } from "../actions/action";
import { NodeType } from "./node";

export default class StartNode extends NodeType {
    constructor() {
        super("NODE_START");
    }

    public override onPrevAction(action: ActionType): boolean {
        return false;
    }
}