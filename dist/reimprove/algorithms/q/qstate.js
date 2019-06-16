"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QState = (function () {
    function QState(data, reward) {
        this.data = data;
        this.reward = reward;
        this.transitions = new Map();
        this.final = false;
        this.id = QState.stateId++;
    }
    QState.prototype.setTransition = function (action, transition) {
        if (!this.transitions.has(action) || this.transitions.get(action) === null)
            return this.transitions.set(action, transition).get(action);
        return null;
    };
    QState.prototype.takeAction = function (action) {
        return this.transitions.get(action);
    };
    Object.defineProperty(QState.prototype, "Data", {
        get: function () { return this.data; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QState.prototype, "Reward", {
        get: function () { return this.reward; },
        set: function (reward) { this.reward = reward; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QState.prototype, "Transitions", {
        get: function () { return Array.from(this.transitions.values()); },
        enumerable: true,
        configurable: true
    });
    QState.prototype.setFinal = function () { this.final = true; return this; };
    Object.defineProperty(QState.prototype, "Final", {
        get: function () { return this.final; },
        set: function (final) { this.final = final; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QState.prototype, "Id", {
        get: function () { return this.id; },
        enumerable: true,
        configurable: true
    });
    QState.stateId = 0;
    return QState;
}());
exports.QState = QState;
