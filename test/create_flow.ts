import FlowType, * as Flow from '../src/types/flows/flow';
import * as Load from './load_node_action';


export async function create_flow() {
    const flow: FlowType = new FlowType('My');

    const startIndex = flow.addNode(Load.loadNodeType('NODE_START'));
    const endIndex = flow.addNode(Load.loadNodeType("NODE_END"));
    const endIndex1 = flow.addNode(Load.loadNodeType("NODE_END"));
    // const actionIndex = flow.addAction('ACTION_OK');

    try {
        flow.attachNextNode(startIndex, 'ACTION_OK', endIndex);
        flow.attachNextNode(startIndex, 'ACTION_OK', endIndex1);
        // flow.attachAction(Flow.AttachPosition.NEXT, startIndex, actionIndex);
        // flow.attachAction(Flow.AttachPosition.PREV, endIndex, actionIndex);
        // flow.attachAction(Flow.AttachPosition.PREV, endIndex, actionIndex);
        
        // flow.onActionTriggered(actionIndex)
        //     .then(() => {
        //         flow.show();
        //     });
        flow.show();
        await flow.onStart();
        // flow.unattachNextNode(startIndex, 'ACTION_OK', endIndex);
        // flow.removeNode(endIndex1);
        flow.show();
    } catch (error) {
        console.log(error);
    }
}
