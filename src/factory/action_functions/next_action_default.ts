import { ActionData, Action, OnActionState, ActionResult } from "../node_base";

export function next_action_default(action: Action, data?: ActionData): Promise<ActionResult> {
    return Promise.resolve({
        state: action.state || OnActionState.DISMISS,
        data: {...action.payload, ...data }
    });           
}