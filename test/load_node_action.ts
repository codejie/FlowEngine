import { NodeType } from '../src/types/nodes/node';
import StartNode from '../src/types/nodes/start_node';
import EndNode from '../src/types/nodes/end_node';

import { ActionType } from '../src/types/actions/action';
import OkAction from '../src/types/actions/ok_action';


// export const globalNodes: NodeType[] = [];
export const globalActions: ActionType[] = [];


export function loadNodeType(id: string): NodeType {
    switch(id) {
        case 'NODE_START':
            return new StartNode();
        case 'NODE_END':
            return new EndNode();
        default:
            throw new Error(`unknown node type - ${id}`);
    }
}

export function loadActionType(id: string): ActionType {
    switch(id) {
        case 'ACTION_OK':
            return new OkAction();
        default:
            throw new Error(`unknown action type - ${id}`);        
    }
}