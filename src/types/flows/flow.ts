import { ActionMode, ActionType } from "../actions/action"
import { ActionData, BaseType, OnActionState } from "../base"
import { NodeType } from "../nodes/node"


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
    node: NodeType,
    state: NodeState
}

interface ActionIndex {
    id: string
    mode: ActionMode,
    nextNodes: number[],
    state: ActionState    
}

interface NodeActionIndex {
    [key: number] : ActionIndex[]
}

export default class FlowType extends BaseType {
    private index: number = 0;

    private nodes: NodeIndex[] = [];
    private nodeActions: NodeActionIndex = {};

    protected findActionIndex(nodeIndex: number, actionId: string): ActionIndex | undefined {
        const node = this.nodeActions[nodeIndex];
        return node?.find(element => (element.id === actionId));

        // return this.actions.find(element => (element.prevNode === nodeIndex && element.id == actionId));
    }

    protected findNodeIndex(nodeIndex?: number): NodeIndex | undefined {
        return this.nodes.find(element => element.index === nodeIndex);
    }

    public addNode(node: NodeType): number {
        const index = ++ this.index;
        this.nodes.push({
            index: index,
            node: node,
            state: NodeState.INIT
        });

        node.getNextActions().forEach(action => {
            this.nodeActions[index].push({
                id: action.id,
                mode: action.mode,
                nextNodes: [],
                state: ActionState.INIT
            });

            // this.actions.push({
            //     prevNode: index,
            //     id: action.id,
            //     mode: action.mode,
            //     nextNodes: [],
            //     state: ActionState.INIT
            // });          
        });
        return index;
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

    // public getActions(): ActionIndex[] {
    //     return this.actions;
    // }

    public show(): void {
        function showNode(node: NodeIndex): string {
            return `[${node.index}](${node.node.id})`;
        }
        function showAction(flow: FlowType, action: ActionIndex): string {
            const prevNode = flow.findNodeIndex(action.prevNode);
            
            let ret = `${showNode(prevNode!)}<-(${action.id})->`;
            
            action.nextNodes.forEach(next => {
                const nextNode = flow.findNodeIndex(next);
                ret += `${showNode(nextNode!)}|`;
            });
            
            return ret;
        }
        // nodes
        console.log('Nodes:');
        this.nodes.forEach(node => {
            console.log(`\t${showNode(node)}`);
        });

        // actions
        console.log('Actions:');
        Object.keys(this.nodeActions).forEach(key => {
            
        });

        this.actions.forEach(action => {
            console.log(`\t${showAction(this, action)}`)
        });
    }

    public checkNodeAutoAction(nodeIndex: number): Promise<OnActionState> {
        this.actions.forEach()
        const node = this.findNodeIndex(nodeIndex);
        if 
    }

    public async onAction(nodeIndex: number, actionId: string, data: ActionData): Promise<OnActionState> { //ActionResult
        const action = this.findActionIndex(nodeIndex, actionId);
        action && (action!.state = ActionState.TRIGGERED);

        const node = this.findNodeIndex(action?.prevNode);
        if (node) {
            node.state = NodeState.PASSED;
            const preRet = await node?.node.onNextAction(actionId, data);
            if (preRet.state === OnActionState.DISMISS) {
                const action = this.findActionIndex(nodeIndex, actionId);
                action?.nextNodes.forEach(async node => {
                    const nextNode = this.findNodeIndex(node);
                    await nextNode?.node.onPrevAction(data);
                    
                    nextNode && (nextNode.state = NodeState.ACTIVED);
                });  
            }
            return preRet.state;        
        }
        return OnActionState.DISMISS;
    }
}