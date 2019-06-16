import { AgentConfig, AgentTrackingInformation } from "./agent_config";
import { QAction } from "./q/qaction";
import { QTransition } from "./q/qtransition";
export declare abstract class AbstractAgent {
    private name;
    protected agentConfig: AgentConfig;
    protected constructor(agentConfig?: AgentConfig, name?: string);
    readonly abstract AgentConfig: AgentConfig;
    protected setAgentConfig(config: AgentConfig): void;
    Name: string;
    abstract getTrackingInformation(): AgentTrackingInformation;
    abstract reset(): void;
    abstract infer(input: number[] | number[][] | QAction, epsilon?: number, keepTensors?: boolean): number | QTransition;
}
