// import Flow from "../src/flow/flow";

import FlowBase from "../src/factory/flow_base";
import FlowFactory from "../src/factory/flow_factory";

// export async function new_flow() {
//     const flow: Flow = new Flow("new");

//     const startIndex = await flow.addNode('NODE_START');
//     const endIndex = await flow.addNode('NODE_END');
//     flow.attachNextNode(startIndex, 'ACTION_AUTO', endIndex);

//     flow.show();
//     await flow.onStart();
//     flow.show();
// }

export async function new_flow() {
    // const flow: Flow = new Flow("new");

    // const startIndex = await flow.addNode('NODE_START');
    // const endIndex = await flow.addNode('NODE_END');
    // const inputIndex = await flow.addNode('NODE_INPUT');
    // const outputIndex = await flow.addNode('NODE_OUTPUT');
    // flow.attachNextNode(startIndex, 'ACTION_AUTO', inputIndex);
    // flow.attachNextNode(inputIndex, "ACTION_OK", outputIndex);
    // flow.attachNextNode(outputIndex, "ACTION_AUTO", endIndex);

    // flow.show();
    // await flow.onStart();
    // flow.show();
    // await flow.onAction(inputIndex, 'ACTION_OK', {'value': 'hello'});
    // flow.show();

    const flow: FlowBase = await FlowFactory.load('test.json');
    flow.show();
    await flow.onStart();
    // await flow.onNextAction(5, 'ACTION_OK', {"a": 111});
    flow.show();
}