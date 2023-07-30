import { BaseType } from "../base";
import { ActionType } from "../actions/action";

interface NodeAttribute {

}

interface NodeStyle {

}

interface NodePermission {

}

export abstract class NodeType extends BaseType {
    public type: number;
    public attributes: NodeAttribute[] = []
    public style: NodeStyle = {}
    public permission: NodePermission = {}

    protected nextActions: string[] = []; // actioinId

    constructor(id: string, type: number = 0, name?: string, description?: string) {
        super(id, name, description);
        this.type = type;
        this.initNextActions();
    }

    protected initNextActions(): void {}

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