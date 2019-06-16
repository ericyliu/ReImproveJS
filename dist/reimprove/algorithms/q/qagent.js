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
var abstract_agent_1 = require("../abstract_agent");
var qmatrix_1 = require("./qmatrix");
var DEFAULT_QAGENT_CONFIG = {
    createMatrixDynamically: false,
    dataHash: null,
    gamma: 0.9
};
var QAgent = (function (_super) {
    __extends(QAgent, _super);
    function QAgent(config, qmatrix, name) {
        var _this = this;
        if ((!qmatrix || (qmatrix && !qmatrix.HashFunction)) && !config.dataHash)
            throw new Error("A hash function MUST be provided in the config parameter in order to hash correctly QStateData.");
        if (qmatrix && !qmatrix.InitialState)
            throw new Error("Please provide an initial state for your QMatrix (qmatrix.setInitialState())");
        if (!qmatrix && !config.initialState)
            throw new Error("Please provide initial state data for your agent !");
        _this = _super.call(this, config, name) || this;
        _this.AgentConfig = __assign({}, _this.AgentConfig, __assign({}, DEFAULT_QAGENT_CONFIG, config));
        _this.history = [];
        _this.previousTransition = null;
        _this.qmatrix = qmatrix ? qmatrix : new qmatrix_1.QMatrix(config.dataHash);
        if (!_this.qmatrix.HashFunction) {
            _this.qmatrix.HashFunction = config.dataHash;
        }
        _this.currentState = qmatrix ? qmatrix.InitialState : _this.qmatrix.registerState(config.initialState);
        _this.lossOnAlreadyVisited = false;
        if (!qmatrix) {
            if (!config.createMatrixDynamically || !config.actions)
                throw new Error("Need actions and flag to create matrix dynamically. You should provide them or provide precreated QMatrix.");
            config.actions.forEach(function (a) { return _this.qmatrix.registerAction(a); });
            _this.qmatrix.Actions.forEach(function (a) { return _this.qmatrix.registerTransition(a.Name, _this.currentState, null); });
            _this.qmatrix.setStateAsInitial(_this.currentState);
        }
        return _this;
    }
    QAgent.prototype.getTrackingInformation = function () {
        return undefined;
    };
    QAgent.prototype.restart = function () {
        this.history = [];
        this.currentState = this.qmatrix.InitialState;
    };
    QAgent.prototype.infer = function () {
        var action = QAgent.bestAction.apply(QAgent, this.currentState.Transitions);
        this.previousTransition = this.currentState.takeAction(action.Action);
        this.history.push(this.previousTransition);
        return this.previousTransition;
    };
    QAgent.prototype.isPerforming = function () {
        return !this.currentState.Final;
    };
    QAgent.prototype.learn = function (data) {
        if (this.previousTransition) {
            this.updateMatrix(data);
            var reward = this.previousTransition.To.Reward - (this.lossOnAlreadyVisited && this.history.indexOf(this.previousTransition) !== this.history.length - 1 ? 1 : 0);
            this.previousTransition.Q = reward + this.AgentConfig.gamma * QAgent.bestAction.apply(QAgent, this.previousTransition.To.Transitions).Q;
        }
    };
    QAgent.prototype.updateMatrix = function (data) {
        var _this = this;
        if (!this.previousTransition.To) {
            var state_1;
            if (this.qmatrix.exists(data)) {
                state_1 = this.qmatrix.getStateFromData(data);
            }
            else {
                state_1 = this.qmatrix.registerState(data);
                this.qmatrix.Actions.forEach(function (a) { return _this.qmatrix.registerTransition(a.Name, state_1, null); });
            }
            this.qmatrix.updateTransition(this.previousTransition.Id, state_1);
            this.currentState = state_1;
        }
        else {
            this.currentState = this.previousTransition.To;
        }
    };
    QAgent.prototype.finalState = function (reward, state) {
        this.qmatrix.setStateAsFinal(state ? state : this.currentState);
        this.currentState.Reward = reward;
    };
    QAgent.bestAction = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var bests = [values[0]];
        for (var i = 1; i < values.length; ++i) {
            if (values[i].Q > bests[0].Q)
                bests = [values[i]];
            if (values[i].Q === bests[0].Q)
                bests.push(values[i]);
        }
        return bests[Math.floor(Math.random() * Math.floor(bests.length))];
    };
    Object.defineProperty(QAgent.prototype, "QMatrix", {
        get: function () {
            return this.qmatrix;
        },
        set: function (qmatrix) {
            this.qmatrix = qmatrix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QAgent.prototype, "History", {
        get: function () {
            return this.history;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QAgent.prototype, "CurrentState", {
        get: function () {
            return this.currentState;
        },
        set: function (state) {
            this.currentState = state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QAgent.prototype, "AgentConfig", {
        get: function () {
            return this.agentConfig;
        },
        set: function (config) {
            this.setAgentConfig(config);
        },
        enumerable: true,
        configurable: true
    });
    QAgent.prototype.getStatesGraph = function () {
        return this.qmatrix.getGraphData();
    };
    QAgent.prototype.reset = function () {
    };
    QAgent.prototype.setLossOnAlreadyVisitedState = function (toggle) {
        this.lossOnAlreadyVisited = toggle;
    };
    return QAgent;
}(abstract_agent_1.AbstractAgent));
exports.QAgent = QAgent;
