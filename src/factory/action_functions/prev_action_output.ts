import { Action, ActionData } from "../node_base";
import Logger from '../../logger';

export function prev_action_output(action: Action, data?: ActionData): Promise<number | void> {
    Logger.info(data);

    return Promise.resolve()
}