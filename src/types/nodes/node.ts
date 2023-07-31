import { BaseType } from "../base";
import { ActionType } from "../actions/action";

interface NodeAttribute {

}

interface NodeStyle {

}

interface NodePermission {

}

enum NextActionState {
    DISABLED = 0,
    ENABLED = 1
}

interface NextActionIndex {
    [key: string]: NextActionState
}

export abstract class NodeType extends BaseType {
    public type: number;
    public attributes: NodeAttribute[] = []
    public style: NodeStyle = {}
    public permission: NodePermission = {}

    protected nextActions: NextActionIndex = {}; // actioinId + state

    constructor(id: string, type: number = 0, name?: string, description?: string) {
        super(id, name, description);
        this.type = type;
    }

    protected addNextAction(id: string, state: NextActionState = NextActionState.ENABLED): void {
        this.nextActions[id] = state;
    }

    public getNextActions(): string[] {
        return Object.keys(this.nextActions);
    }

    public onNextAction(actionId: string): Promise<any> | Promise<undefined> {
        return Promise.resolve(undefined);
    }

    public async onPrevAction(actionId: string, data?: any): Promise<void> {
        await this.createTask(actionId, data);
        return Promise.resolve();
    }

    protected createTask(actioId: string, data?: any): Promise<number> {
        return Promise.resolve(0);// task id
    }

    // public abstract save(): void;
    // public abstract load(): void;
}
