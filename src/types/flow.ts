import { ActionType } from "./actions/action"
import { BaseType } from "./base"
import { NodeType } from "./nodes/node"

// interface Action {
//     index: number,
//     id: string,
//     prevNode?: number, // index
//     nextNode?: number
// }

// interface FlowChain {
//     index: number,
//     nextActions: Action[] // index
// }

enum NodeState {
    INIT = 0
}

enum ActionState {
    INIT = 0
}

interface NodeIndexes {
    [key: number]: { // index
        node: NodeType
        nextActions: number[],
        state: NodeState
    }
}

interface ActionIndexes {
    [key: number]: {
        id: string,
        prevNode?: number, // index
        nextNode?: number,
        state: ActionState
    }
}

enum AttachPosition {
    PREV = 0,
    NEXT = 1
}

export default class FlowType extends BaseType {
    private index: number = 0;

    private nodes: NodeIndexes = {};
    private actions: ActionIndexes = {};

    public addNode(node: NodeType): number;
    public addNode(id: string): number;
    public addNode(node: NodeType | string): number {
        if (node instanceof NodeType) {
            this.nodes[++ this.index]  = {
                node,
                nextActions: [],
                state: NodeState.INIT
            };

            return this.index;
        } else {
            throw new Error("not implemented.");
        }
    }

    public addAction(id: string): number {
        this.actions[++ this.index] = {
            id,
            state: ActionState.INIT
        }
        return this.index;
    }

    public attachAction(position: AttachPosition, node: number, action: number): void {
        switch (position) {
            case AttachPosition.NEXT:
                this.nodes[node].nextActions.push(action);
                this.actions[action].prevNode = node;
                break;
            case AttachPosition.PREV:
                this.actions[action].nextNode = node;
                break;
            default:
                throw new Error(`unkonwn position - ${position}`);
        }    
    }

    public unattachAction(position: AttachPosition, node: number, action: number): void {
        switch (position) {
            case AttachPosition.NEXT:
                this.nodes[node].nextActions.splice(this.nodes[node].nextActions.indexOf(action), 1);
                this.actions[action].prevNode = undefined;
                break;
            case AttachPosition.PREV:
                this.actions[action].nextNode = undefined;;
                break;
            default:
                throw new Error(`unkonwn position - ${position}`);
        }
    }

    // save
    // load
}