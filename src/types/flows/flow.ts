import { ActionType } from "../actions/action"
import { BaseType } from "../base"
import { NodeType } from "../nodes/node"

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
    INIT = 0,
    PASSED = 1,
    ACTIVED = 2
}

enum ActionState {
    INIT = 0,
    TRIGGERED = 1
}

interface NodeIndexes {
    [key: number]: { // index
        node: NodeType
        prevActions: number[],
        nextActions: number[],
        state: NodeState
    }
}

interface ActionIndexes {
    [key: number]: {
        id: string,
        prevNode: number | undefined, // index
        nextNode: number[],
        state: ActionState
    }
}

export enum AttachPosition {
    PREV = 0,
    NEXT = 1
}

export interface TraverseNode {
    index: number,
    id: string,
    state: number,
    name?: string,
    description?: string
}

export interface TraverseAction {
    index: number,
    id: string,
    state: number,
    name?: string,
    description?: string,

    prevNode: number | undefined,
    nextNode: number[]
}

export interface TraverseResult {
    nodes: TraverseNode[],
    actions: TraverseAction[]
}

export default class FlowType extends BaseType {
    private index: number = 0;

    private nodes: NodeIndexes = {};
    private actions: ActionIndexes = {};

    // private currentNode: number = 0;

    public addNode(node: NodeType): number;
    public addNode(id: string): number;
    public addNode(node: NodeType | string): number {
        if (node instanceof NodeType) {
            this.nodes[++ this.index]  = {
                node,
                prevActions: [],
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
            prevNode: undefined,
            nextNode: [],
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
                this.nodes[node].prevActions.push(action);
                if (this.actions[action].nextNode.indexOf(node) === -1)
                    this.actions[action].nextNode.push(node);
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
                this.nodes[node].prevActions.splice(this.nodes[node].prevActions.indexOf(action), 1);
                this.actions[action].nextNode.splice(this.actions[action].nextNode.indexOf(node), 1);
                break;
            default:
                throw new Error(`unkonwn position - ${position}`);
        }
    }

    // save
    // load

    public traverse(): TraverseResult {
        const result: TraverseResult = {
            nodes: [],
            actions: []
        };

        for (const key in this.nodes) {
            const node = this.nodes[key];
            result.nodes.push({
                index: key as unknown as number,
                id: node.node.id,
                state: node.state,
            })
        }

        for (const key in this.actions) {
            const action = this.actions[key];
            result.actions.push({
                index: key as unknown as number,
                id: action.id,
                state: action.state,
                prevNode: action.prevNode,
                nextNode: action.nextNode
            })
        }

        return result;
    }

    public show(): void {
        function showNode(nodes: NodeIndexes, index?: number | number[]): string {
            if (index) {
                if (index instanceof Array) {
                    let ret = '';
                    index.forEach(node => {
                        ret += `[${nodes[node].state === NodeState.INIT ? '' : '*' }${node}](${nodes[node].node.id})|`
                    })
                    return ret;
                } else {
                    return `[${nodes[index].state === NodeState.INIT ? '' : '*' }${index}](${nodes[index].node.id})`;
                }
            } else {
                return '[]()';
            }
        }

        const result = this.traverse();
        console.log(`Nodes: ${result.nodes.length}`);
        for (const node of result.nodes) {
            console.log(`\t${showNode(this.nodes, node.index)}`)
        }

        console.log(`Actions: ${result.actions.length}`);
        for (const action of result.actions) {
            console.log(`\t${showNode(this.nodes, action.prevNode)}<-[${action.index}]${action.id}->${showNode(this.nodes, action.nextNode)}`)
        }
    }

    public async onActionTriggered(index: number): Promise<void> {
        const action = this.actions[index];
        if (!action.prevNode || !action.nextNode) {
            throw new Error('action missing node.');
        }
        const prevNode = this.nodes[action.prevNode];
        const preRet = await prevNode.node.onNextAction(action.id);
        prevNode.state = NodeState.PASSED;
        
        action.nextNode.forEach(async node => {
            const nextNode = this.nodes[node];
            await nextNode.node.onPrevAction(action.id, preRet);
            nextNode.state = NodeState.ACTIVED;
        })

        action.state = ActionState.TRIGGERED;

        return Promise.resolve();
    }
}