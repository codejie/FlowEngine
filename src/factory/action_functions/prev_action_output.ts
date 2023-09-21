import { NodeAction, ActionData, NodeBase } from "../node_base";
import Logger from '../../logger';
import FlowBase, { NodeIndex, ActionIndex } from "../flow_base";

export function prev_action_output(flow: FlowBase, nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData): Promise<number | void> {
    Logger.debug('prev_output:', data);

    return Promise.resolve()
}