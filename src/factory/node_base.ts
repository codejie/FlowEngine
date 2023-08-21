
export enum ParameterFlag {
    OPTIONAL = 'OPTIONAL',
    REQUIRED = 'REQUIRED'
}

export enum ActionMode {
    NORMAL = 'NORMAL',
    AUTO = 'AUTO',
    DELAY = 'DELAY'
}

export enum OnActionState {
    DISMISS = 0,
    KEEP = 1
}

export type ActionData = any;

export interface ActionResult {
    state: OnActionState,
    data: ActionData    
}

export interface Parameter {
    name: string,
    value: any,
    flag?: ParameterFlag
}

export interface Action {
    id: string,
    mode?: ActionMode,
    state?: OnActionState,
    payload?: any
}

export class NodeBase {
    public id: string;
    public name?: string;
    public description?: string;

    public parameters: Parameter[] = [];
    public actions: Action[] = [];

    public constructor(id: string, name?: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    protected findAction(id: string): Action | undefined {
        return this.actions.find(item => item.id === id);
    }

    protected createTask(actioId: string, data?: ActionData): Promise<number> {
        return Promise.resolve(0);// task id
    }

    public addParameter(param: Parameter): void {
        this.parameters.push(param);
    }

    public addNextAction(action: Action): void {
        this.actions.push(action);
    }

    public onNextAction(actionId: string, data?: ActionData): Promise<ActionResult> {
        const action = this.findAction(actionId);
        if (action) {
            return Promise.resolve({
                state: action.state || OnActionState.DISMISS,
                data: {...action.payload, ...data }
            });
        } else {
            return Promise.reject(new Error('Not found action - '+ actionId));
        }
    }

    public onPrevAction(actionId: string, data?: ActionData): Promise<number> {
        return this.createTask(actionId, data);
    }
}