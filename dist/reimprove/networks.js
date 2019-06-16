"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_1 = require("@tensorflow/tfjs");
var NeuralNetwork = (function () {
    function NeuralNetwork() {
        this.neuralNetworkLayers = [];
        this.inputShape = [0];
    }
    NeuralNetwork.prototype.addNeuralNetworkLayer = function (layer) {
        if (typeof layer == 'number') {
            this.neuralNetworkLayers.push({
                units: layer,
                activation: NeuralNetwork.DEFAULT_LAYER.activation,
                type: 'dense'
            });
        }
        else {
            this.neuralNetworkLayers.push(__assign({}, NeuralNetwork.DEFAULT_LAYER, layer));
        }
    };
    NeuralNetwork.prototype.addNeuralNetworkLayers = function (layers) {
        var _this = this;
        layers.forEach(function (l) { return _this.addNeuralNetworkLayer(l); });
    };
    Object.defineProperty(NeuralNetwork.prototype, "InputShape", {
        set: function (shape) {
            this.inputShape = shape;
        },
        enumerable: true,
        configurable: true
    });
    NeuralNetwork.prototype.createLayers = function (includeInputShape) {
        if (includeInputShape === void 0) { includeInputShape = true; }
        var genLayers = [];
        if (includeInputShape)
            this.neuralNetworkLayers[0].inputShape = this.inputShape;
        for (var _i = 0, _a = this.neuralNetworkLayers; _i < _a.length; _i++) {
            var layer = _a[_i];
            genLayers.push(layer.type == "dense" ? tfjs_1.layers.dense(layer) : tfjs_1.layers.dropout(layer));
        }
        return genLayers;
    };
    NeuralNetwork.prototype.getLayers = function () { return this.neuralNetworkLayers; };
    NeuralNetwork.DEFAULT_LAYER = {
        units: 32,
        activation: "relu",
        type: 'dense'
    };
    return NeuralNetwork;
}());
exports.NeuralNetwork = NeuralNetwork;
var ConvolutionalNeuralNetwork = (function (_super) {
    __extends(ConvolutionalNeuralNetwork, _super);
    function ConvolutionalNeuralNetwork() {
        var _this = _super.call(this) || this;
        _this.convolutionalLayers = [];
        _this.flattenLayer = { type: 'flatten' };
        return _this;
    }
    ConvolutionalNeuralNetwork.prototype.addMaxPooling2DLayer = function (layer) {
        this.convolutionalLayers.push(__assign({}, ConvolutionalNeuralNetwork.DEFAULT_POOLING_LAYER, layer));
    };
    ConvolutionalNeuralNetwork.prototype.addConvolutionalLayer = function (layer) {
        if (typeof layer == 'number') {
            this.convolutionalLayers.push({
                filters: layer,
                activation: ConvolutionalNeuralNetwork.DEFAULT_CONV_LAYER.activation,
                type: 'convolutional',
                kernelSize: ConvolutionalNeuralNetwork.DEFAULT_CONV_LAYER.kernelSize
            });
        }
        else {
            this.convolutionalLayers.push(__assign({}, ConvolutionalNeuralNetwork.DEFAULT_CONV_LAYER, layer));
        }
    };
    ConvolutionalNeuralNetwork.prototype.addConvolutionalLayers = function (layers) {
        var _this = this;
        layers.forEach(function (l) { return _this.addConvolutionalLayer(l); });
    };
    ConvolutionalNeuralNetwork.prototype.createLayers = function (includeInputShape) {
        if (includeInputShape === void 0) { includeInputShape = true; }
        var genLayers = [];
        this.convolutionalLayers[0].inputShape = this.inputShape;
        for (var _i = 0, _a = this.convolutionalLayers; _i < _a.length; _i++) {
            var layer = _a[_i];
            genLayers.push(layer.type == "convolutional" ? tfjs_1.layers.conv2d(layer) : tfjs_1.layers.maxPooling2d(layer));
        }
        genLayers.push(tfjs_1.layers.flatten(this.flattenLayer));
        return genLayers.concat(_super.prototype.createLayers.call(this, false));
    };
    Object.defineProperty(ConvolutionalNeuralNetwork.prototype, "FlattenLayer", {
        set: function (layer) {
            this.flattenLayer = layer;
        },
        enumerable: true,
        configurable: true
    });
    ConvolutionalNeuralNetwork.prototype.getLayers = function () { return this.convolutionalLayers.concat(this.flattenLayer, _super.prototype.getLayers.call(this)); };
    ConvolutionalNeuralNetwork.DEFAULT_CONV_LAYER = {
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        type: 'convolutional'
    };
    ConvolutionalNeuralNetwork.DEFAULT_POOLING_LAYER = {
        poolSize: 2,
        strides: null,
        type: "maxpooling"
    };
    return ConvolutionalNeuralNetwork;
}(NeuralNetwork));
exports.ConvolutionalNeuralNetwork = ConvolutionalNeuralNetwork;
