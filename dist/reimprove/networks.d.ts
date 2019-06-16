import { Tensor } from '@tensorflow/tfjs';
export interface Layer {
    activation?: string | any;
    useBias?: boolean;
    name?: string;
    inputShape?: number[];
}
export interface ConvolutionalNetworkLayer extends Layer {
    type: 'convolutional' | 'maxpooling';
}
export interface ConvolutionalLayer extends ConvolutionalNetworkLayer {
    type: 'convolutional';
    filters: number;
    strides?: number | number[];
    kernelSize: number;
}
export interface MaxPooling2DLayer extends ConvolutionalNetworkLayer {
    poolSize?: number;
    strides?: [number, number];
    type: 'maxpooling';
}
export interface NeuralNetworkLayer extends Layer {
    units: number;
    type: 'dense' | 'dropout' | 'flatten';
}
export interface DenseLayer extends NeuralNetworkLayer {
    type: 'dense';
}
export interface DropoutLayer extends NeuralNetworkLayer {
    type: 'dropout';
    rate: number;
    seed?: number;
}
export interface FlattenLayer extends Layer {
    batchInputShape?: number[];
    batchSize?: number;
    trainable?: boolean;
    updatable?: boolean;
    weights?: Tensor[];
    type: "flatten";
}
export declare class NeuralNetwork {
    protected inputShape: number[];
    private readonly neuralNetworkLayers;
    private static DEFAULT_LAYER;
    constructor();
    addNeuralNetworkLayer(layer: number | NeuralNetworkLayer): void;
    addNeuralNetworkLayers(layers: Array<number | NeuralNetworkLayer>): void;
    InputShape: number[];
    createLayers(includeInputShape?: boolean): Array<any>;
    getLayers(): Layer[];
}
export declare class ConvolutionalNeuralNetwork extends NeuralNetwork {
    private readonly convolutionalLayers;
    private flattenLayer;
    private static DEFAULT_CONV_LAYER;
    private static DEFAULT_POOLING_LAYER;
    constructor();
    addMaxPooling2DLayer(layer?: MaxPooling2DLayer): void;
    addConvolutionalLayer(layer: number | ConvolutionalNetworkLayer): void;
    addConvolutionalLayers(layers: Array<number | ConvolutionalNetworkLayer>): void;
    createLayers(includeInputShape?: boolean): Array<any>;
    FlattenLayer: FlattenLayer;
    getLayers(): Layer[];
}
