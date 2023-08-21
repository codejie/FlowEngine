import { readFile } from "fs";
import { Action, NodeBase, Parameter } from "./node_base";

const NODE_DEFINITION_ROOT = "/Users/Jie/Code/git/FlowEngine/src/definitions/nodes/";

const NodeDefinitions: {
    [key in string]: string
} = {
    "NODE_START": "start.json",
    "NODE_END": "end.json",
    "NODE_INPUT": "input.json"
}

export default class NodeFactory {
    public static async make(id: string): Promise<NodeBase> {       
        const json = await NodeFactory.loadJSON(id);
        const node = new NodeBase(id, json.name, json.description);
        if (json.parameters) {
            json.parameters.forEach((item: Parameter) => {
                node.addParameter(item);
            });
        }
        if (json.actions) {
            json.actions.forEach((item: Action) => {
                node.addNextAction(item);
            });
        }
        return node;
    }

    private static loadJSON(id: string): Promise<any> {
        const file: string = NODE_DEFINITION_ROOT + NodeDefinitions[id];
        return new Promise<any>((resolve, reject) => {
            readFile(file, 'utf-8', (error, data) => {
                if (error) return reject(error);
                return resolve(JSON.parse(data));
            });
        });
    }
}