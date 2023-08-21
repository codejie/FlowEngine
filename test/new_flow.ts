import Flow from "../src/flow/flow";

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
    const flow: Flow = new Flow("new");

    const startIndex = await flow.addNode('NODE_START');
    const endIndex = await flow.addNode('NODE_END');
    const inputIndex = await flow.addNode('NODE_INPUT');
    flow.attachNextNode(startIndex, 'ACTION_AUTO', inputIndex);
    flow.attachNextNode(inputIndex, "ACTION_OK", endIndex)

    flow.show();
    await flow.onStart();
    flow.show();
    await flow.onAction(inputIndex, 'ACTION_OK', {'value': 'hello'});
    flow.show();
}