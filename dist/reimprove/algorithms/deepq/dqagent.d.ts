import { Memento, Memory } from '../../memory';
import { Model } from '../../model';
import { Tensor } from '@tensorflow/tfjs-core';
import { DQAgentConfig, AgentTrackingInformation } from '../agent_config';
import { AbstractAgent } from '../abstract_agent';
export declare class DQAgent extends AbstractAgent {
    private model;
    private done;
    private currentReward;
    private readonly actionsBuffer;
    private readonly statesBuffer;
    private readonly inputsBuffer;
    private lossesHistory;
    private rewardsHistory;
    private readonly netInputWindowSize;
    memory: Memory;
    private forwardPasses;
    constructor(model: Model, agentConfig?: DQAgentConfig, name?: string);
    private createNeuralNetInput(input);
    private policy(input);
    infer(input: number[] | number[][], epsilon: number, keepTensors?: boolean): number;
    memorize(): void;
    createTrainingDataFromMemento(memento: Memento, gamma: number, alpha: number): {
        x: Tensor;
        y: Tensor;
    };
    listen(input: number[] | number[][], epsilon: number): number;
    learn(gamma: number, alpha: number): Promise<void>;
    addReward(value: number): void;
    setReward(value: number): void;
    reset(): void;
    AgentConfig: DQAgentConfig;
    getTrackingInformation(): AgentTrackingInformation;
}
