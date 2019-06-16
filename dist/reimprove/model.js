"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tflayers = __importStar(require("@tensorflow/tfjs-layers"));
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var lodash_1 = require("lodash");
var v4_1 = __importDefault(require("uuid/v4"));
var DEFAULT_MODEL_FIT_CONFIG = {
    epochs: 10,
    stepsPerEpoch: 200
};
var LayerType;
(function (LayerType) {
    LayerType["DENSE"] = "DENSE";
    LayerType["CONV2D"] = "CONV2D";
    LayerType["FLATTEN"] = "FLATTEN";
})(LayerType = exports.LayerType || (exports.LayerType = {}));
var DEFAULT_LAYER_CONFIG = {
    units: 32,
    activation: 'relu',
    useBias: false
};
var Model = (function () {
    function Model(config, fitConfig) {
        this.model = new tflayers.Sequential(config);
        this.fitConfig = __assign({}, DEFAULT_MODEL_FIT_CONFIG, fitConfig);
    }
    Model.loadFromFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var model, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        model = new Model();
                        if (!(typeof file === "string")) return [3, 2];
                        _a = model;
                        return [4, tflayers.loadModel(file)];
                    case 1:
                        _a.model = _c.sent();
                        return [3, 4];
                    case 2:
                        _b = model;
                        return [4, tflayers.loadModel(tfjs_core_1.io.browserFiles([file.json, file.weights]))];
                    case 3:
                        _b.model = _c.sent();
                        _c.label = 4;
                    case 4: return [2, model];
                }
            });
        });
    };
    Model.prototype.export = function (destination, place) {
        if (place === void 0) { place = 'downloads'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.model.save(place + "://" + destination)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Model.prototype.addLayer = function (type, config) {
        if (this.model instanceof tflayers.Sequential) {
            var conf = DEFAULT_LAYER_CONFIG;
            if (config.inputShape)
                conf.inputShape = config.inputShape;
            switch (type) {
                case LayerType.DENSE:
                    conf.units = config.units;
                    conf.activation = config.activation;
                    this.model.add(tflayers.layers.dense(conf));
                    break;
                case LayerType.CONV2D:
                    conf.filters = config.units;
                    conf.activation = config.activation;
                    conf.useBias = config.useBias;
                    this.model.add(tflayers.layers.conv2d(conf));
                    break;
                case LayerType.FLATTEN:
                    conf = {};
                    this.model.add(tflayers.layers.flatten(conf));
                    break;
            }
        }
        else {
            throw new Error("Unable to add a layer to an already created model managed by tensorflowjs");
        }
    };
    Model.prototype.compile = function (config) {
        this.model.compile(config);
        return this;
    };
    Model.prototype.predict = function (x, config) {
        return new Result(this.model.predict(x, config));
    };
    Model.prototype.fit = function (x, y) {
        return this.model.fit(x, y, this.fitConfig);
    };
    Model.prototype.randomOutput = function () {
        return lodash_1.random(0, this.OutputSize);
    };
    Object.defineProperty(Model.prototype, "OutputSize", {
        get: function () {
            return this.model.getOutputAt(0).shape[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "InputSize", {
        get: function () {
            return this.model.layers[0].batchInputShape[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "FitConfig", {
        set: function (fitConfig) {
            this.fitConfig = __assign({}, DEFAULT_MODEL_FIT_CONFIG, fitConfig);
        },
        enumerable: true,
        configurable: true
    });
    Model.FromNetwork = function (network, fitConfig, name) {
        if (name === void 0) { name = v4_1.default(); }
        return new Model({
            name: name,
            layers: network.createLayers()
        }, fitConfig);
    };
    return Model;
}());
exports.Model = Model;
var Result = (function () {
    function Result(result) {
        this.result = result;
    }
    Result.prototype.getResultAndDispose = function (t) {
        this.result.dispose();
        return t.dataSync();
    };
    Result.prototype.getHighestValue = function () {
        var _this = this;
        return tfjs_core_1.tidy(function () { return _this.getResultAndDispose(_this.result.as1D().max())[0]; });
    };
    Result.prototype.getAction = function () {
        var _this = this;
        return tfjs_core_1.tidy(function () { return _this.getResultAndDispose(_this.result.as1D().argMax())[0]; });
    };
    Result.prototype.getValue = function () {
        var resTensor = this.result.as1D();
        var result = resTensor.dataSync();
        resTensor.dispose();
        this.result.dispose();
        return result;
    };
    return Result;
}());
exports.Result = Result;
