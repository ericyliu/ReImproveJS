import { Tensor } from "@tensorflow/tfjs-core";
export interface MemoryConfig {
    size: number;
}
export interface Memento {
    state: MementoTensor;
    action: number;
    reward: number;
    nextState: MementoTensor;
}
export interface MementoTensor {
    tensor: Tensor;
    references: number;
}
export declare class Memory {
    config: MemoryConfig;
    memory: Array<Memento>;
    currentSize: number;
    constructor(config: MemoryConfig);
    remember(memento: Memento, replaceIfFull?: boolean): void;
    sample(batchSize: number, unique?: boolean): Memento[];
    readonly CurrentSize: number;
    readonly Size: number;
    private static freeMemento(memento);
    reset(): void;
    merge(other: Memory): void;
}
