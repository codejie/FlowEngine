import { readFile } from "fs";
import { ActionBase } from "./action_base";

const ACTION_DEFINITION_ROOT = "/Users/Jie/Code/git/FlowEngine/src/definitions/actions/";
const ActionDefinitions: {
    [key in string]: string
} = {
    "ACTION_AUTO": "auto.json",
    "ACTION_OK": "ok.json",
    "ACTION_CANCEL": "cancel.json"
}

export default class ActionFactory {
    public static async make(id: string): Promise<ActionBase> {
        const json = await ActionFactory.loadJSON(id);
        const action = new ActionBase(id, json.name, json.description);
        return action;                
    }

    private static loadJSON(id: string): Promise<any> {
        const file: string = ACTION_DEFINITION_ROOT + ActionDefinitions[id];
        return new Promise<any>((resolve, reject) => {
            readFile(file, 'utf-8', (error, data) => {
                if (error) return reject(error);
                return resolve(JSON.parse(data));
            });
        });
    }

}