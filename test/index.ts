// import { create_flow } from "./create_flow";
// import { test } from "./mysql";
import { new_flow } from "./new_flow";

import Logger from '../src/logger';
import ActionFactory from "../src/factory/action_factory";
import NodeFactory from "../src/factory/node_factory";

Logger.debug('HelloWorld!');
Logger.flush();

async function init(): Promise<void> {
    await ActionFactory.loadCollection();
    await NodeFactory.loadCollection();
}

async function test(): Promise<void> {
    await init();
    await new_flow();
    console.log('Test Done.');
}


try {
    test();
} catch (error) {
    console.error(error);
}

