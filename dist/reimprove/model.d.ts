import * as tflayers from '@tensorflow/tfjs-layers';
import { Tensor } from '@tensorflow/tfjs-core';
import { NeuralNetwork } from "./networks";
export declare enum LayerType {
    DENSE = "DENSE",
    CONV2D = "CONV2D",
    FLATTEN = "FLATTEN",
}
export interface LayerConfig {
    units: number;
    inputShape?: Array<number>;
    activation: string;
    useBias?: boolean;
}
export declare class Model {
    model: tflayers.Model;
    fitConfig: tflayers.ModelFitConfig;
    constructor(config?: tflayers.SequentialConfig, fitConfig?: tflayers.ModelFitConfig);
    static loadFromFile(file: string | {
        json: File;
        weights: File;
    }): Promise<Model>;
    export(destination: string, place?: string): Promise<void>;
    addLayer(type: LayerType, config: LayerConfig): void;
    compile(config: tflayers.ModelCompileConfig): Model;
    predict(x: Tensor, config?: tflayers.ModelPredictConfig): Result;
    fit(x: Tensor, y: Tensor): Promise<any>;
    randomOutput(): number;
    readonly OutputSize: number;
    readonly InputSize: number;
    FitConfig: tflayers.ModelFitConfig;
    static FromNetwork(network: NeuralNetwork, fitConfig?: tflayers.ModelFitConfig, name?: string): Model;
}
export declare class Result {
    private result;
    constructor(result: Tensor);
    private getResultAndDispose(t);
    getHighestValue(): number;
    getAction(): number;
    getValue(): Int32Array | Float32Array | Uint8Array;
}
