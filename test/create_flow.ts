import FlowType from '../src/types/flow';
import * as Load from './load_node_action';


const flow: FlowType = new FlowType('My');

flow.addNode(Load.loadNodeType('NODE_START'));
flow.addNode(Load.loadNodeType("NODE_END"));
flow.addAction()