import { NodeAction, ActionData } from "../node_base";
import Logger from '../../logger';

export function prev_action_output(action: NodeAction, data?: ActionData): Promise<number | void> {
    Logger.info(data);

    return Promise.resolve()
}