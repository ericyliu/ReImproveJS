import { AbstractAgent } from "../abstract_agent";
import { AgentTrackingInformation, QAgentConfig } from "../agent_config";
import { QTransition } from "./qtransition";
import { QState, QStateData } from "./qstate";
import { GraphEdge, GraphNode, QMatrix } from "./qmatrix";
export declare class QAgent extends AbstractAgent {
    private history;
    private previousTransition;
    private currentState;
    private qmatrix;
    private lossOnAlreadyVisited;
    constructor(config: QAgentConfig, qmatrix?: QMatrix, name?: string);
    getTrackingInformation(): AgentTrackingInformation;
    restart(): void;
    infer(): QTransition;
    isPerforming(): boolean;
    learn(data?: QStateData): void;
    updateMatrix(data: QStateData): void;
    finalState(reward: number, state?: QState): void;
    private static bestAction(...values);
    QMatrix: QMatrix;
    readonly History: QTransition[];
    CurrentState: QState;
    AgentConfig: QAgentConfig;
    getStatesGraph(): {
        nodes: GraphNode[];
        edges: GraphEdge[];
    };
    reset(): void;
    setLossOnAlreadyVisitedState(toggle: boolean): void;
}
