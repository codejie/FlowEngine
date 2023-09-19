import { readFile } from "fs";
import { ActionMode, NodeBase, OnActionState, OptionFlag } from "./node_base";
import { getOnNextActionFunction, getOnPrevActionFunction } from "./action_function_factory";

const NODE_DEFINITION_ROOT = "/Users/Jie/Code/git/FlowEngine/src/definitions/nodes/";

// const NodeDefinitions: {
//     [key in string]: string
// } = {
//     "NODE_START": "start.json",
//     "NODE_END": "end.json",
//     "NODE_INPUT": "input.json",
//     "NODE_OUTPUT": "output.json"
// }

const NodeDefinitions: string[] = [
    'start.json',
    'end.json',
    'input.json',
    'output.json',
    'auto.json'
];

type NodeCollection = {
    [key in string]: NodeBase
};

export default class NodeFactory {
    private static nodeCollection: NodeCollection = {};

    public static fetchNode(id: string): NodeBase | undefined {
        return NodeFactory.nodeCollection[id];
    }

    public static async loadCollection(): Promise<void> {
        // const ret: NodeCollection = {};
        for (const file of NodeDefinitions) {
            const json = await NodeFactory.loadJSON(file);
            const node = new NodeBase(json.id, json.name, json.description);
            if (json.options) {
                json.options.forEach((item: any) => {
                    node.addOption({
                        name: item.name,
                        type: item.type,
                        flag: item.flag || OptionFlag.OPTIONAL
                    });
                });
            }
            if (json.nextActions) {
                json.nextActions.forEach((item: any) => {
                    node.addNextAction({
                        id: item.id,
                        mode: item.mode || ActionMode.NORMAL,
                        onResult: item.OnActionState || OnActionState.DISMISS,
                        payload: item.payload,
                        onAction: getOnNextActionFunction(item.onAction)
                    });
                });
            }
            if (json.onPrevAction) {
                node.onPrevAction = getOnPrevActionFunction(json.prevAction);
            }
            NodeFactory.nodeCollection[json.id] = node;
        }
        // return ret;
    }

    // public static async make(id: string): Promise<NodeBase> {       
    //     const json = await NodeFactory.loadJSON(id);
    //     const node = new NodeBase(id, json.name, json.description);
    //     if (json.parameters) {
    //         json.parameters.forEach((item: any) => {
    //             node.addParameter({
    //                 name: item.name,
    //                 value: item.value,
    //                 flag: item.flag
    //             });
    //         });
    //     }
    //     if (json.nextActions) {
    //         json.nextActions.forEach((item: any) => {
    //             node.addNextAction({
    //                 id: item.id,
    //                 mode: item.mode || ActionMode.NORMAL,
    //                 onResult: item.OnActionState || OnActionState.DISMISS,
    //                 payload: item.payload,
    //                 onAction: getOnNextActionFunction(item.onAction)
    //             });
    //         });
    //     }
    //     if (json.prevAction) {
    //         node.prevAction = getOnPrevActionFunction(json.prevAction);
    //     }
    //     return node;
    // }

    private static loadJSON(index: string): Promise<any> {
        const file: string = NODE_DEFINITION_ROOT + index; //NodeDefinitions[id];
        return new Promise<any>((resolve, reject) => {
            readFile(file, 'utf-8', (error, data) => {
                if (error) return reject(error);
                return resolve(JSON.parse(data));
            });
        });
    }

}