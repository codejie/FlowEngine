import Logger from '../logger';
import { OnNextActionFunction, OnPrevActionFunction } from './action_function_factory';

export enum OptionFlag {
    OPTIONAL = 'OPTIONAL',
    REQUIRED = 'REQUIRED'
}

export enum ActionMode {
    NORMAL = 'NORMAL',
    AUTO = 'AUTO',
    DELAY = 'DELAY',
    TRIGGER = 'TRIGGER', // from NORMAL to AUTO
    INSTANT = 'INSTANT' // from DELAY to AUTO
}

export enum OnActionState {
    DISMISS = 0,
    KEEP = 1
}

export type ActionData = any;

export interface ActionResult {
    onState: OnActionState,
    data?: ActionData    
}

export interface Option {
    name: string,
    type: string,
    default?: any,
    flag?: OptionFlag
}

type Options = {
    [key in string]: any
}

export interface NodeAction { // NodeAction
    id: string,
    mode: ActionMode,
    onState: OnActionState,
    payload?: any,
    onAction: OnNextActionFunction
}

export class NodeBase {
    public id: string;
    public name?: string;
    public description?: string;

    public options: Options = {};
    public nextActions: NodeAction[] = [];
    public onPrevAction?: OnPrevActionFunction;

    public constructor(id: string, name?: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public findNextAction(id: string): NodeAction | undefined {
        return this.nextActions.find(item => item.id === id);
    }

    protected createTask(actioId: string, data?: ActionData): Promise<number> {
        return Promise.resolve(0);// task id
    }

    public addOption(option: Option): void {
        // this.options.push(option);
        this.options[option.name] = option.default;
    }

    public addNextAction(action: NodeAction): void {
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

    // public onPrevAction(actionId: string, data?: ActionData): Promise<number> {
    //     Logger.debug(`onPrevAction - [${this.id}](${actionId})`);
    //     Logger.debug('data:\n', data);

    //     return this.createTask(actionId, data);
    // }
}