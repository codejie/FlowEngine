import { ActionData, OnActionState } from "../base";
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

    public startFlow(flow: number): Promise<OnActionState | void> {
        const f: FlowType | undefined = this.flows[flow];
        if (!f) {
            throw new Error('not found flow - ' + flow);
        }
        return f.onStart();
    }

    public onAction(flow: number, nodeIndex: number, actionId: string, data?: ActionData): Promise<OnActionState> {
        const f: FlowType | undefined = this.flows[flow];
        if (!f) {
            throw new Error('not found flow - ' + flow);
        }

        return f.onAction(nodeIndex, actionId, data);
    }

}