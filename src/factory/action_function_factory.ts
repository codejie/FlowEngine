import { prev_action_output } from "./action_functions/prev_action_output";
import { ActionData, ActionResult, Action } from "./node_base";

export type OnNextActionFunction = (action: Action, data?: ActionData) => Promise<ActionResult>;
export type OnPrevActionFunction = (action: Action, data?: ActionData) => Promise<number | void>;

const OnNextActionFunctionDefinitions: {
    [key in string]: OnNextActionFunction
} = {

}

const OnPrevActionFunctionDefinitions: {
    [key in string]: OnPrevActionFunction
} = {
    "prev_action_output": prev_action_output
}

export function getOnNextActionFunction(onAction: string): OnNextActionFunction | undefined {
    return OnNextActionFunctionDefinitions[onAction];
}

export function getOnPrevActionFunction(onAction: string): OnPrevActionFunction | undefined {
    return OnPrevActionFunctionDefinitions[onAction];
}