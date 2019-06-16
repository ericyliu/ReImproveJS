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
Object.defineProperty(exports, "__esModule", { value: true });
var memory_1 = require("../../memory");
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var lodash_1 = require("lodash");
var typed_window_1 = require("../../misc/typed_window");
var abstract_agent_1 = require("../abstract_agent");
var MEM_WINDOW_MIN_SIZE = 2;
var HIST_WINDOW_SIZE = 100;
var HIST_WINDOW_MIN_SIZE = 0;
var DEFAULT_AGENT_CONFIG = {
    memorySize: 30000,
    batchSize: 32,
    temporalWindow: 1,
};
var DQAgent = (function (_super) {
    __extends(DQAgent, _super);
    function DQAgent(model, agentConfig, name) {
        var _this = _super.call(this, agentConfig, name) || this;
        _this.model = model;
        _this.AgentConfig = __assign({}, DEFAULT_AGENT_CONFIG, agentConfig);
        _this.done = false;
        _this.currentReward = 0;
        _this.lossesHistory = new typed_window_1.TypedWindow(HIST_WINDOW_SIZE, HIST_WINDOW_MIN_SIZE, -1);
        _this.rewardsHistory = new typed_window_1.TypedWindow(HIST_WINDOW_SIZE, HIST_WINDOW_MIN_SIZE, null);
        _this.memory = new memory_1.Memory({ size: _this.AgentConfig.memorySize });
        _this.netInputWindowSize = Math.max(_this.AgentConfig.temporalWindow, MEM_WINDOW_MIN_SIZE);
        _this.actionsBuffer = new Array(_this.netInputWindowSize);
        _this.inputsBuffer = new Array(_this.netInputWindowSize);
        _this.statesBuffer = new Array(_this.netInputWindowSize);
        _this.forwardPasses = 0;
        return _this;
    }
    DQAgent.prototype.createNeuralNetInput = function (input) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var finalInput = input.clone();
            var _loop_1 = function (i) {
                finalInput = finalInput.concat(_this.statesBuffer[_this.netInputWindowSize - 1 - i], 1);
                var ten = tfjs_core_1.tensor([
                    lodash_1.range(0, _this.model.OutputSize).map(function (val) {
                        return val == _this.actionsBuffer[_this.netInputWindowSize - 1 - i]
                            ? 1.0
                            : 0.0;
                    }),
                ]);
                finalInput = finalInput.concat(ten, 1);
            };
            for (var i = 0; i < _this.AgentConfig.temporalWindow; ++i) {
                _loop_1(i);
            }
            return finalInput;
        });
    };
    DQAgent.prototype.policy = function (input) {
        return this.model.predict(input).getAction();
    };
    DQAgent.prototype.infer = function (input, epsilon, keepTensors) {
        if (keepTensors === void 0) { keepTensors = true; }
        this.forwardPasses += 1;
        var action;
        var netInput;
        var tensorInput;
        if (Array.isArray(input) && Array.isArray(input[0]))
            tensorInput = tfjs_core_1.tensor(input);
        else if (Array.isArray(input))
            tensorInput = tfjs_core_1.tensor2d([input], [1, input.length]);
        else
            throw new Error('Unable to create convenient tensor for training.');
        if (this.forwardPasses > this.AgentConfig.temporalWindow) {
            netInput = this.createNeuralNetInput(tensorInput);
            if (lodash_1.random(0, 1, true) < epsilon) {
                action = this.model.randomOutput();
            }
            else {
                action = this.policy(netInput);
            }
        }
        else {
            action = this.model.randomOutput();
            netInput = tfjs_core_1.tensor([]);
        }
        var stateShifted = this.statesBuffer.shift();
        if (stateShifted)
            stateShifted.dispose();
        this.statesBuffer.push(tensorInput);
        if (keepTensors) {
            this.actionsBuffer.shift();
            this.inputsBuffer.shift();
            this.actionsBuffer.push(action);
            this.inputsBuffer.push({ tensor: netInput, references: 0 });
        }
        else {
            netInput.dispose();
        }
        return action;
    };
    DQAgent.prototype.memorize = function () {
        this.rewardsHistory.add(this.currentReward);
        if (this.forwardPasses <= this.AgentConfig.temporalWindow + 1)
            return;
        this.memory.remember({
            action: this.actionsBuffer[this.netInputWindowSize - MEM_WINDOW_MIN_SIZE],
            reward: this.currentReward,
            state: this.inputsBuffer[this.netInputWindowSize - MEM_WINDOW_MIN_SIZE],
            nextState: this.inputsBuffer[this.netInputWindowSize - 1],
        });
    };
    DQAgent.prototype.createTrainingDataFromMemento = function (memento, gamma, alpha) {
        var _this = this;
        return tfjs_core_1.tidy(function () {
            var target = memento.reward;
            if (!_this.done) {
                target =
                    alpha *
                        (memento.reward +
                            gamma *
                                _this.model.predict(memento.nextState.tensor).getHighestValue());
            }
            var future_target = _this.model.predict(memento.state.tensor).getValue();
            future_target[memento.action] += target;
            return {
                x: memento.state.tensor.clone(),
                y: tfjs_core_1.tensor2d(future_target, [1, _this.model.OutputSize]),
            };
        });
    };
    DQAgent.prototype.listen = function (input, epsilon) {
        var action = this.infer(input, epsilon, true);
        this.memorize();
        return action;
    };
    DQAgent.prototype.learn = function (gamma, alpha) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var trainData, history, loss;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        trainData = this.memory
                            .sample(this.AgentConfig.batchSize)
                            .map(function (memento) { return _this.createTrainingDataFromMemento(memento, gamma, alpha); })
                            .reduce(function (previousValue, currentValue) {
                            var res = {
                                x: previousValue.x.concat(currentValue.x),
                                y: previousValue.y.concat(currentValue.y),
                            };
                            previousValue.x.dispose();
                            previousValue.y.dispose();
                            currentValue.x.dispose();
                            currentValue.y.dispose();
                            return res;
                        });
                        return [4, this.model.fit(trainData.x, trainData.y)];
                    case 1:
                        history = _a.sent();
                        loss = history.history.loss[0];
                        this.lossesHistory.add(loss);
                        trainData.x.dispose();
                        trainData.y.dispose();
                        return [2];
                }
            });
        });
    };
    DQAgent.prototype.addReward = function (value) {
        this.currentReward += value;
    };
    DQAgent.prototype.setReward = function (value) {
        this.currentReward = value;
    };
    DQAgent.prototype.reset = function () {
        this.memory.reset();
        this.inputsBuffer.forEach(function (i) { return i.tensor.dispose(); });
        this.statesBuffer.forEach(function (s) { return s.dispose(); });
        this.forwardPasses = 0;
    };
    Object.defineProperty(DQAgent.prototype, "AgentConfig", {
        get: function () {
            return this.agentConfig;
        },
        set: function (config) {
            this.setAgentConfig(config);
        },
        enumerable: true,
        configurable: true
    });
    DQAgent.prototype.getTrackingInformation = function () {
        return {
            averageReward: this.rewardsHistory.mean(),
            averageLoss: this.lossesHistory.mean(),
            name: this.Name,
        };
    };
    return DQAgent;
}(abstract_agent_1.AbstractAgent));
exports.DQAgent = DQAgent;
