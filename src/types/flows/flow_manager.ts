import FlowType from "./flow";

interface FlowIndexes {
    [key: number]: FlowType
}

export default class FlowManager {
    private index: number;
    private flows: FlowIndexes = {}

    constructor(index: number) {
        this.index = index;
    }

    public createFlow(flow: FlowType): number {
        this.flows[++ this.index] = flow;

        return this.index;
    }

    public onAction(flow: number, action: number): Promise<void> {
        const f: FlowType | undefined = this.flows[flow];
        if (!f) {
            throw new Error('not found flow - ' + flow);
        }

        return f.onActionTriggered(action);
    }

}