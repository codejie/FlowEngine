import FlowBase, { ActionIndex, NodeIndex } from "../flow_base";
import { ActionData, ActionMode, NodeAction, NodeBase } from "../node_base";
import Logger from '../../logger';

export function prev_action_merge(flow: FlowBase, nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData): Promise<number | void> {
    Logger.debug('prev_action_output:[%s] - [%o]', node.id, data);

    node.options.actionCount ++;
    Logger.debug('prev_action_output: actionCount = [%d]', node.options.actionCount);
    if (node.options.actionCount > 1) {
        node.findNextAction('ACTION_OK')!.mode = ActionMode.TRIGGER;
        Logger.debug('ActionMode CHANGED');
    }
    return Promise.resolve(0);
}