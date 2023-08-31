import Logger from "../logger";
import { Action, ActionMode, NodeBase, OnActionState } from "./node_base";
import NodeFactory from "./node_factory";

enum NodeParameterFlag {
    REQUIRED = 'required',
    OPTIONAL = 'optional'
}

interface NodeParameter {
    name: string,
    value: any,
    flag: NodeParameterFlag
}

enum ActionState {
    INIT = 0,
    TRIGGERED = 1
}

interface ActionIndex {
    id: string,
    nextNodes: number[],

    state?: ActionState
}

enum NodeState {
    INIT = 0,
    PASSED = 1,
    ACTIVED = 2
}

export interface NodeIndex {
    index: number,
    id: string,
    paramsters?: NodeParameter[],
    actions?: ActionIndex[],

    state?: NodeState
}

export default class FlowBase {
    public id: string;
    public name?: string;
    public description?: string;

    protected index: number = 0;
    protected nodeIndexes: NodeIndex[] = [];

    public constructor(id: string, name?: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    protected makeNodeParameters(parameters?: NodeParameter[]): NodeParameter[] {
        // if (!parameters) return undefined;
        const ret: NodeParameter[] = [];
        parameters?.forEach(item => {
            ret.push({
                name: item.name,
                value: item.value,
                flag: item.flag
            });
        });
        return ret;
    }

    protected makeNodeActions(actions?: ActionIndex[]): ActionIndex[] {
        // if (!actions) return undefined;
        const ret: ActionIndex[] = [];
        actions?.forEach(item => {
            ret.push({
                id: item.id,
                nextNodes: item.nextNodes || [],
                state: ActionState.INIT
            })
        });
        return ret;
    }

    public addNodeIndex(nodeId: string, parameters?: NodeParameter[], actions?: ActionIndex[], index?: number): number {
        this.nodeIndexes.push({
            index: index || ++ this.index,
            id: nodeId,
            paramsters: this.makeNodeParameters(parameters),
            actions: this.makeNodeActions(actions),
            state: NodeState.INIT
        });

        return this.index;
    }

    protected findNodeIndex(index: number): NodeIndex | undefined {
        return this.nodeIndexes.find(item => (item.index === index));
    }

    public onStart(): Promise<OnActionState | void> {
        const nodeIndex = this.nodeIndexes.find(item => item.id === 'NODE_START');
        if (nodeIndex) {
            return this.checkNodeAutoAction(nodeIndex);
        }
        return Promise.resolve();
    }

    public checkNodeAutoAction(nodeIndex: NodeIndex): Promise<void | OnActionState> {
        if (nodeIndex.actions) {
            const node = NodeFactory.fetchNode(nodeIndex.id);
            if (node) {
                for (const actionIndex of nodeIndex.actions) {
                    const action = node.nextActions.find(item => (item.id === actionIndex.id && item.mode === ActionMode.AUTO));
                    if (action) {
                        return this.onNextAction(nodeIndex, node, actionIndex, action);
                    }
                }
            }
        }
         return Promise.resolve();
    }

    protected onNextAction(nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: Action): Promise<void | OnActionState> {
        nodeIndex.state = NodeState.PASSED;
        return action.onAction.call(this, nodeIndex, actionIndex);
    }

    public onNextAction(index: number, actionId: string) {
        
    } 

    public show(): void {
        function showNode(nodeIndex?: NodeIndex): string {
            if (nodeIndex) {
                return `[${nodeIndex.index}](${nodeIndex.id}@${nodeIndex.state})`;
            } else {
                return '';
            }
        }
        function showAction(prev: NodeIndex, action: ActionIndex, next?: NodeIndex): string {
             return `${showNode(prev)}<-(${action.id}@${action.state})->${showNode(next)}`;
        }
        // nodes
        Logger.info('Nodes:');
        this.nodeIndexes.forEach(node => {
            Logger.info(`\t${showNode(node)}`);
        });

        // actions
        Logger.info('Actions:');
        this.nodeIndexes.forEach(nodeIndex => {
            nodeIndex.actions?.forEach(actionIndex => {
                actionIndex.nextNodes.forEach(nextIndex => {
                    const nextNodeIndex = this.findNodeIndex(nextIndex);
                    Logger.info(`\t${showAction(nodeIndex, actionIndex, nextNodeIndex)}`);
                });
            });
        });
    }
}