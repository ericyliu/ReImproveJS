import { QAction } from "./qaction";
import { QState } from "./qstate";
export declare class QTransition {
    private from;
    private to;
    private action;
    private QValue;
    private readonly id;
    private static transitionId;
    constructor(from: QState, to: QState, action: QAction);
    Q: number;
    From: QState;
    To: QState;
    readonly Action: QAction;
    readonly Id: number;
}
