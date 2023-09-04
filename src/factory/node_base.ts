import Logger from '../logger';
import { OnNextActionFunction, OnPrevActionFunction } from './action_function_factory';

export enum OptionFlag {
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
    onState: OnActionState,
    data: ActionData    
}

export interface Option {
    name: string,
    type: string,
    flag?: OptionFlag
}

export interface Action {
    id: string,
    mode: ActionMode,
    onResult: OnActionState,
    payload?: any,
    onAction: OnNextActionFunction
}

export class NodeBase {
    public id: string;
    public name?: string;
    public description?: string;

    public options: Option[] = [];
    public nextActions: Action[] = [];
    public prevAction?: OnPrevActionFunction;

    public constructor(id: string, name?: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    protected findNextAction(id: string): Action | undefined {
        return this.nextActions.find(item => item.id === id);
    }

    protected createTask(actioId: string, data?: ActionData): Promise<number> {
        return Promise.resolve(0);// task id
    }

    public addOption(option: Option): void {
        this.options.push(option);
    }

    public addNextAction(action: Action): void {
        this.nextActions.push(action);
    }

    // public onNextAction(actionId: string, data?: ActionData): Promise<ActionResult> {
    //     const action = this.findNextAction(actionId);
    //     if (action) {
    //         Logger.debug(`onNextAction - [${this.id}](${actionId})`);
    //         Logger.debug('data:\n', data);
    //         // if (action)
    //         return Promise.resolve({
    //             onResult: action.onResult,
    //             data: {...action.payload, ...data }
    //         });
    //     } else {
    //         return Promise.reject(new Error('Not found action - '+ actionId));
    //     }
    // }

    // public onNextAction(actionId: string, data?: ActionData): Promise<ActionResult> {

    // }

    public onPrevAction(actionId: string, data?: ActionData): Promise<number> {
        Logger.debug(`onPrevAction - [${this.id}](${actionId})`);
        Logger.debug('data:\n', data);

        return this.createTask(actionId, data);
    }
}