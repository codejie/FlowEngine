import { ActionType } from "./action";

export default class OkAction extends ActionType {
    constructor() {
        super("ACTION_OK");
    }
}