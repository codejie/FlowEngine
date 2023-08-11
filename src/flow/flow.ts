import { ActionMode, NodeBase, OnActionState, ActionData } from "../factory/node_base";
import NodeFactory from "../factory/node_factory";


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
    mode: ActionMode,
    nextNodes: number[],
    state: ActionState    
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

    protected findNodeIndex(nodeIndex?: number): NodeIndex | undefined {
        return this.nodes.find(element => element.index === nodeIndex);
    }

    public async addNode(id: string): Promise<number> {
        const node = await NodeFactory.make(id)
        const nextActions: ActionIndex[] = [];
        
        node.actions.forEach(action => {
            nextActions.push({
                id: action.id,
                mode: action.mode || ActionMode.NORMAL,
                nextNodes: [],
                state: ActionState.INIT
            });
        });

        const index = ++ this.index;
        this.nodes.push({
            index: index,
            node: node,
            state: NodeState.INIT,
            nextActions: nextActions
        });

        return index;
    }

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
        console.log('Nodes:');
        this.nodes.forEach(node => {
            console.log(`\t${showNode(node)}`);
        });

        // actions
        console.log('Actions:');
        this.nodes.forEach(node => {
            node.nextActions.forEach(action => {
                action.nextNodes.forEach(nextNode => {
                    const next = this.findNodeIndex(nextNode);
                    console.log(`\t${showAction(node, action, next)}`);
                });
            });
        });
    }

    public onStart(): Promise<OnActionState | void> {
        const node = this.nodes.find(nodeIndex => nodeIndex.node.id === 'NODE_START');
        if (node)
            return this.checkNodeAutoAction(node);
        return Promise.resolve();
    }

    public checkNodeAutoAction(node: NodeIndex): Promise<OnActionState | void> {
        const actionIndex = node.nextActions.find(element => element.mode === ActionMode.AUTO);
        if (actionIndex) {
            return this.onAction(node.index, actionIndex.id);
        }
        return Promise.resolve();
    }

    public async onAction(nodeIndex: number, actionId: string, data?: ActionData): Promise<OnActionState> { //ActionResult
        const action = this.findActionIndex(nodeIndex, actionId);
        action && (action!.state = ActionState.TRIGGERED);

        const node = this.findNodeIndex(nodeIndex);
        if (node) {
            node.state = NodeState.PASSED;
            const preRet = await node?.node.onNextAction(actionId, data);
            if (preRet.state === OnActionState.DISMISS) {
                // const action = this.findActionIndex(nodeIndex, actionId);
                action?.nextNodes.forEach(async node => {
                    const nextNode = this.findNodeIndex(node);
                    if (nextNode) {
                        nextNode.state = NodeState.ACTIVED;
                        await nextNode.node.onPrevAction(data);
                        await this.checkNodeAutoAction(nextNode);
                    }
                });  
            }
            return preRet.state;        
        }
        return OnActionState.DISMISS;
    }
}