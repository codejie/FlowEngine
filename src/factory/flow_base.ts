import Logger from "../logger";
import ActionFactory from "./action_factory";
import { NodeAction, ActionData, ActionMode, NodeBase, OnActionState } from "./node_base";
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

export interface ActionIndex {
    id: string,
    nextNodes: number[],

    state?: ActionState
}

enum NodeState {
    INIT = 0,
    PASSED = 2,
    ACTIVED = 1
}

export interface NodeIndex {
    index: number,
    id: string,
    paramsters?: NodeParameter[],
    actions: ActionIndex[],

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
        if (nodeIndex.actions.length > 0) {
            const node = NodeFactory.fetchNode(nodeIndex.id);
            if (node) {
                for (const actionIndex of nodeIndex.actions) {
                    const action = node.nextActions.find(item => (item.id === actionIndex.id && (item.mode === ActionMode.AUTO || item.mode == ActionMode.TRIGGER || item.mode == ActionMode.INSTANT)));
                    if (action) {
                        return this.onNodeNextAction(nodeIndex, node, actionIndex, action, action.payload);
                    }
                }
            }
        }
         return Promise.resolve();
    }

    public onNextAction(index: number, actionId: string, data?: ActionData): Promise<void | OnActionState>  {
        const nodeIndex = this.findNodeIndex(index);
        if (nodeIndex) {
            const actionIndex = nodeIndex.actions.find(item => item.id === actionId);
            if (actionIndex) {
                const node = NodeFactory.fetchNode(nodeIndex.id);
                if (node) {
                    const action = node.nextActions.find(item => item.id === actionIndex.id);
                    if (action) {
                        return this.onNodeNextAction(nodeIndex, node, actionIndex, action, {...action.payload, ...data});
                    }
                }
            }
        }
        return Promise.resolve();
    }

    protected async onNodePrevAction(nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData): Promise<number> {
        nodeIndex.state = NodeState.ACTIVED;
        // const node = NodeFactory.fetchNode(nodeIndex.id);

        // Logger.error('onNodePrevAction() - [%s] - [%o] - [%d]', nodeIndex.id, data, nodeIndex.state);

        // if (node && node.onPrevAction) {
        //     const action = node?.findNextAction(actionIndex.id);
        //     if (action) {
        await node.onPrevAction!(this, nodeIndex, node, actionIndex, action, data);
            // }
        // }
        await this.checkNodeAutoAction(nodeIndex);

        return await this.createTask();
    }

    protected async onNodeNextAction(nodeIndex: NodeIndex, node: NodeBase, actionIndex: ActionIndex, action: NodeAction, data?: ActionData): Promise<void | OnActionState> {
        nodeIndex.state = NodeState.PASSED;
        actionIndex.state = ActionState.TRIGGERED;

        if (action.mode == ActionMode.TRIGGER)
            action.mode = ActionMode.NORMAL;
        else if (action.mode == ActionMode.INSTANT)
            action.mode = ActionMode.DELAY;

        // Logger.debug('onNodeNextAction() - data: ', data);
        
        const ret = await action.onAction(this, nodeIndex, node, actionIndex, action, data);
        if (ret.onState === OnActionState.DISMISS) {
            const allPrevActions: Promise<number>[] = [];
            actionIndex.nextNodes.forEach(async index => {
                const nextNodeIndex = this.findNodeIndex(index);
                if (nextNodeIndex) {
                    const nextNode = NodeFactory.fetchNode(nextNodeIndex.id);
                    allPrevActions.push(this.onNodePrevAction(nextNodeIndex, nextNode, actionIndex, action, ret.data));
                    // await this.onNodePrevAction(nextNodeIndex, actionIndex, ret.data);
                }
            });
            await Promise.all(allPrevActions);

            return Promise.resolve(ret.onState);
        }
        return Promise.resolve();
    }

    protected createTask(): Promise<number> {
        return Promise.resolve(0);
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
        // flow
        Logger.info('Flow:', this.description);
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