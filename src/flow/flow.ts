import { OnNextActionFunction } from "../factory/action_function_factory";
import { ActionMode, NodeBase, OnActionState, ActionData, Action } from "../factory/node_base";
import NodeFactory from "../factory/node_factory";
import Logger from "../logger";

enum NodeState {
    INIT = 0,
    PASSED = 1,
    ACTIVED = 2
}

enum ActionState {
    INIT = 0,
    TRIGGERED = 1
}

interface NodeIndex {
    index: number,
    node: NodeBase,
    state: NodeState,
    nextActions: ActionIndex[]
}

interface ActionIndex {
    id: string
    // mode: ActionMode,
    nextNodes: number[],
    state: ActionState,
    // onAction?: OnNextActionFunction
}

export default class Flow {
    private id: string;

    private index: number = 0;
    private nodes: NodeIndex[] = [];

    public constructor(id: string) {
        this.id = id;
    }

    protected findActionIndex(nodeIndex: number, actionId: string): ActionIndex | undefined {
        const node = this.findNodeIndex(nodeIndex);
        return node?.nextActions.find(element => (element.id === actionId));
    }

    // protected findNodeAction(nodeIndex: number, actionId: string): Action | undefined {
    //     const index = this.findNodeIndex(nodeIndex);
    //     return index?.node.nextActions.find(element => (element.id === actionId));
    // }

    protected findNodeIndex(nodeIndex?: number): NodeIndex | undefined {
        return this.nodes.find(element => element.index === nodeIndex);
    }

    // public async addNode(id: string): Promise<number> {
    //     const node = await NodeFactory.make(id)
    //     const nextActions: ActionIndex[] = [];
        
    //     node.nextActions.forEach(action => {
    //         nextActions.push({
    //             id: action.id,
    //             // mode: action.mode || ActionMode.NORMAL,
    //             nextNodes: [],
    //             state: ActionState.INIT,
    //             // onAction: action.onAction
    //         });
    //     });

    //     const index = ++ this.index;
    //     this.nodes.push({
    //         index: index,
    //         node: node,
    //         state: NodeState.INIT,
    //         nextActions: nextActions
    //     });

    //     return index;
    // }

    public removeNode(nodeIndex: number): number {
        this.nodes = this.nodes.filter(element => element.index !== nodeIndex);

        this.nodes.forEach(node => {
            node.nextActions.forEach(action => {
                action.nextNodes.splice(action.nextNodes.indexOf(nodeIndex), 1);
            });
        })

        return nodeIndex;
    }

    public attachNextNode(nodeIndex: number, actionId: string, nextNodeIndex: number): void {
        const actionIndex = this.findActionIndex(nodeIndex, actionId);
        if (actionIndex) {
            if (actionIndex.nextNodes.indexOf(nextNodeIndex) === -1)
                actionIndex.nextNodes.push(nextNodeIndex);
        }
    }

    public unattachNextNode(nodeIndex: number, actionId: string, nextNodeIndex: number): void {
        const actionIndex = this.findActionIndex(nodeIndex, actionId);
        if (actionIndex) {
            actionIndex.nextNodes.splice(actionIndex.nextNodes.indexOf(nextNodeIndex), 1);
        }
    }

    public getNodes(): NodeIndex[] {
        return this.nodes;
    }

    public show(): void {
        function showNode(node?: NodeIndex): string {
            if (node) {
                return `[${node.index}](${node.node.id}@${node.state})`;
            } else {
                return '';
            }
        }
        function showAction(prev: NodeIndex, action: ActionIndex, next?: NodeIndex): string {
             return `${showNode(prev)}<-(${action.id}@${action.state})->${showNode(next)}`;
        }
        // nodes
        Logger.info('Nodes:');
        this.nodes.forEach(node => {
            Logger.info(`\t${showNode(node)}`);
        });

        // actions
        Logger.info('Actions:');
        this.nodes.forEach(node => {
            node.nextActions.forEach(action => {
                action.nextNodes.forEach(nextNode => {
                    const next = this.findNodeIndex(nextNode);
                    Logger.info(`\t${showAction(node, action, next)}`);
                });
            });
        });
    }

    // public onStart(): Promise<OnActionState | void> {
    //     const node = this.nodes.find(nodeIndex => nodeIndex.node.id === 'NODE_START');
    //     if (node)
    //         return this.checkNodeAutoAction(node);
    //     return Promise.resolve();
    // }

    // public checkNodeAutoAction(nodeIndex: NodeIndex): Promise<OnActionState | void> {
    //     const node = nodeIndex.node;
    //     for (const actionIndex of nodeIndex.nextActions) {
    //         const action = node.nextActions.find(element => element.id === actionIndex.id);
    //         if (action?.mode === ActionMode.AUTO) {
    //             return this.onNextAction(nodeIndex, actionIndex, action);// action.onAction!.call(node, action);
    //         }
    //     }
    //     return Promise.resolve();

        // const actionIndex = node.nextActions.find(element => element.mode === ActionMode.AUTO);
        // if (actionIndex) {
        //     return this.onAction(node.index, actionIndex.id);
        // }
        // return Promise.resolve();
    // }

    // protected async onNextAction(nodeIndex: NodeIndex, actionIndex: ActionIndex, action: Action, data?: ActionData): Promise<OnActionState> {
    //     nodeIndex.state = NodeState.PASSED;
    //     const actionResult = await nodeIndex.node.onNextAction() action.onAction.call(nodeIndex, action, data);
    //     if (actionResult.onState === OnActionState.DISMISS) {
    //         actionIndex.nextNodes.forEach(async nextIndex => {
    //             const nextNode = this.findNodeIndex(nextIndex);
    //             if (nextNode) {
    //                 nextNode.state = NodeState.ACTIVED;
    //                 await nextNode.node.onPrevAction.call(nodeIndex, action, actionResult.data);
    //             }

    //         });
    //     }
    //     throw new Error("Method not implemented.");
    // }

    // public async onAction(nodeIndex: number, actionId: string, data?: ActionData): Promise<OnActionState> { //ActionResult
    //     Logger.debug(`[${nodeIndex}](${actionId}) is triggered.`);
    //     Logger.debug('playload:\n', data);

    //     const action = this.findActionIndex(nodeIndex, actionId);
    //     action && (action!.state = ActionState.TRIGGERED);

    //     Logger.debug(`[${nodeIndex}](${actionId}) is triggered.`);
    //     Logger.debug('playload:\n', data);
        

        const node = this.findNodeIndex(nodeIndex);
        if (node) {
            node.state = NodeState.PASSED;
            const preRet = await node?.node.onNextAction(actionId, data);
            if (preRet.onState === OnActionState.DISMISS) {
                // const action = this.findActionIndex(nodeIndex, actionId);
                action?.nextNodes.forEach(async node => {
                    const nextNode = this.findNodeIndex(node);
                    if (nextNode) {
                        nextNode.state = NodeState.ACTIVED;
                        await nextNode.node.onPrevAction(actionId, preRet.data);
                        await this.checkNodeAutoAction(nextNode);
                    }
                });  
            }
            return preRet.onState;        
        }
        return OnActionState.DISMISS;
    // }
}