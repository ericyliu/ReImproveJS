import { QTransition } from "./qtransition";
import { QAction } from "./qaction";
export interface QStateData {
    [key: string]: any;
}
export declare class QState {
    private readonly data;
    private reward;
    private transitions;
    private final;
    private readonly id;
    private static stateId;
    constructor(data: QStateData, reward: number);
    setTransition(action: QAction, transition: QTransition): QTransition;
    takeAction(action: QAction): QTransition;
    readonly Data: QStateData;
    Reward: number;
    readonly Transitions: QTransition[];
    setFinal(): QState;
    Final: boolean;
    readonly Id: number;
}
