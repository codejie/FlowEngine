import { ActionMode } from "../actions/action";
import { ActionData, ActionResult, BaseType, OnActionState } from "../base";

interface NodeAttribute {

}

interface NodeStyle {

}

interface NodePermission {

}

interface NextAction {
    id: string,
    mode: ActionMode
}

export abstract class NodeType extends BaseType {
    public type: number;
    public attributes: NodeAttribute[] = []
    public style: NodeStyle = {}
    public permission: NodePermission = {}

    protected nextActions: NextAction[] = []; // actionId // NextActionIndex = {}; // actioinId + state

    constructor(id: string, type: number = 0, name?: string, description?: string) {
        super(id, name, description);
        this.type = type;
    }

    protected addNextAction(id: string, mode: ActionMode = ActionMode.NORMAL): void {
        // this.nextActions[id] = state;
        this.nextActions.push({id, mode});
    }

    public getNextActions(): NextAction[] {
        return this.nextActions;
    }

    public onNextAction(actionId: string, data?: ActionData): Promise<ActionResult> {
        return Promise.resolve({
            state: OnActionState.DISMISS,
            data: undefined
        });
    }

    public async onPrevAction(actionId: string, data?: ActionData): Promise<void> {
        const taskId = await this.createTask(actionId, data);
        
        return Promise.resolve();
    }

    protected createTask(actioId: string, data?: ActionData): Promise<number> {
        return Promise.resolve(0);// task id
    }

    // public abstract save(): void;
    // public abstract load(): void;
}
