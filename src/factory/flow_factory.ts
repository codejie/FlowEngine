import { readFile } from "fs";
import FlowBase, { NodeIndex } from "./flow_base";

const FLOW_DEFINITION_ROOT = "../FlowEngine/src/definitions/flows/";

// const FlowDefinitions: string[] = [
//     'test.json'
// ];

export default class FlowFactory {
    public static async load(file: string, root: string = FLOW_DEFINITION_ROOT): Promise<FlowBase> {
        const json = await FlowFactory.loadJSON(file);
        const flow = new FlowBase(json.id, json.name, json.description);
        json.nodes?.forEach((item: any) => {
            flow.addNodeIndex(item.id, item.parameters, item.actions, item.index);
        });

        return flow;
    }

    // public static create(): FlowBase {

    // }

    private static loadJSON(index: string): Promise<any> {
        const file: string = FLOW_DEFINITION_ROOT + index;
        return new Promise<any>((resolve, reject) => {
            readFile(file, 'utf-8', (error, data) => {
                if (error) return reject(error);
                return resolve(JSON.parse(data));
            });
        });
    }    
}