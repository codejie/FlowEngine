import Logger from "../logger"
import { prev_action_output } from "./action_functions/prev_action_output";
import FlowBase, { NodeIndex, ActionIndex } from "./flow_base";
import { ActionData, ActionResult, NodeBase, NodeAction, OnActionState } from "./node_base";

// export type OnNextActionFunction = (action: Action, data?: ActionData) => Promise<ActionResult>;
// export type OnPrevActionFunction = (action: Action, data?: ActionData) => Promise<number | void>;

// export type OnNextActionFunction = (flow: FlowBase, nodeIndex: NodeIndex, actionIndex: ActionIndex, data?: ActionData) => Promise<ActionResult>;
// export type OnPrevActionFunction = (flow: FlowBase, nodeIndex: NodeIndex, actionIndex: ActionIndex, data?: ActionData) => Promise<number | void>;

export type OnNextActionFunction = (flow: FlowBase, nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData) => Promise<ActionResult>;
export type OnPrevActionFunction = (flow: FlowBase, nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData) => Promise<number | void>;


function defaultOnNextActionFunction(flow: FlowBase, nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData): Promise<ActionResult> {
    return Promise.resolve({
        onState: action.onState || OnActionState.DISMISS,
        data: data
    });
}

function defaultOnPrevActionFunction(flow: FlowBase, nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData): Promise<number | void> {
    Logger.debug()
    return Promise.resolve();
}

const OnNextActionFunctionDefinitions: {
    [key in string]: OnNextActionFunction
} = {

}

const OnPrevActionFunctionDefinitions: {
    [key in string]: OnPrevActionFunction
} = {
    // "prev_action_output": prev_action_output
}

export function getOnNextActionFunction(onAction: string): OnNextActionFunction {
    return OnNextActionFunctionDefinitions[onAction] || defaultOnNextActionFunction;
}

export function getOnPrevActionFunction(onAction: string): OnPrevActionFunction {
    return OnPrevActionFunctionDefinitions[onAction] || defaultOnPrevActionFunction;
}