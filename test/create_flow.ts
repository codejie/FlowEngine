import FlowType, * as Flow from '../src/types/flows/flow';
import * as Load from './load_node_action';


const flow: FlowType = new FlowType('My');

const startIndex = flow.addNode(Load.loadNodeType('NODE_START'));
const endIndex = flow.addNode(Load.loadNodeType("NODE_END"));
const actionIndex = flow.addAction('ACTION_OK');

try {
    flow.attachAction(Flow.AttachPosition.NEXT, startIndex, actionIndex);
    flow.attachAction(Flow.AttachPosition.PREV, endIndex, actionIndex);
    flow.attachAction(Flow.AttachPosition.PREV, endIndex, actionIndex);
    
    flow.onActionTriggered(actionIndex)
        .then(() => {
            flow.show();
        });
    // flow.show();
} catch (error) {
    console.log(error);
}
