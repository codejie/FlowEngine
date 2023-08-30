import { readFile } from "fs";
import { ActionBase } from "./action_base";
import Logger from "../logger";

const ACTION_DEFINITION_ROOT = "/Users/Jie/Code/git/FlowEngine/src/definitions/actions/";
// const ActionDefinitions: {
//     [key in string]: string
// } = {
//     "ACTION_AUTO": "auto.json",
//     "ACTION_OK": "ok.json",
//     "ACTION_CANCEL": "cancel.json"
// }

const ActionDefinitions: string[] = [
    'auto.json',
    'ok.json',
    'cancel.json'
];

type ActionCollection = {
    [key in string]: ActionBase
}

export default class ActionFactory {
    private static actionCollection: ActionCollection = {};

    public fetchAction(id: string): ActionBase | undefined {
        return ActionFactory.actionCollection[id];
    }

    public static async loadCollection(): Promise<void> {
        // const ret: ActionCollection = {};
        for (const file of ActionDefinitions) {
            const json = await ActionFactory.loadJSON(file);
            ActionFactory.actionCollection[json.id] = new ActionBase(json.id, json.name, json.description);
        };
        // return ret;
    }

    private static loadJSON(index: string): Promise<any> {
        const file: string = ACTION_DEFINITION_ROOT + index; //ActionDefinitions[id];
        return new Promise<any>((resolve, reject) => {
            readFile(file, 'utf-8', (error, data) => {
                if (error) return reject(error);
                return resolve(JSON.parse(data));
            });
        });
    }
}

// export const globalActionCollection: ActionCollection = {};

// ActionFactory.loadActionCollection()
//     .then(ret => {
//         Logger.info('Action collection be loaded succ.');
//     })
//     .catch((error: Error) => {
//         Logger.info('Action collection be loaded fail - ' + error.message);
//     });

