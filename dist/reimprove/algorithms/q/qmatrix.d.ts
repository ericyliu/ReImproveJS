import { QAction, QActionData } from "./qaction";
import { QState, QStateData } from "./qstate";
import { QTransition } from "./qtransition";
export interface GraphNode {
    id: number;
    label: string;
    color?: string;
}
export interface GraphEdge {
    from: number;
    to: number;
    id: number;
    label: string;
    arrows: string;
    color: string;
}
export declare class QMatrix {
    private hashFunction;
    private actions;
    private states;
    private transitions;
    private initialState;
    constructor(hashFunction?: (data: QStateData) => string);
    registerAction(action: QAction | string, data?: QActionData): void;
    registerState(data: QStateData, reward?: number): QState;
    registerTransition(action: string, from: QState, to: QState, oppositeActionName?: string): QTransition;
    updateTransition(id: number, to: QState): QTransition | undefined;
    action(name: string): QAction;
    hash(data: QStateData): string;
    static defaultHash(data: QStateData): string;
    getStateFromData(data: QStateData): QState | undefined;
    exists(data: QStateData): boolean;
    private checkAndGetState(state);
    setStateAsInitial(state: QState | QStateData | string): boolean;
    setStateAsFinal(state: QState | QStateData | string): boolean;
    removeStateFromFinals(state: QState | string | QStateData): boolean;
    reset(): void;
    resetTransitions(): void;
    readonly InitialState: QState;
    readonly FinalStates: QState[];
    HashFunction: (data: QStateData) => string;
    readonly States: Array<QState>;
    readonly Actions: Array<QAction>;
    getGraphData(): {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
}
