"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qaction_1 = require("./qaction");
var qstate_1 = require("./qstate");
var qtransition_1 = require("./qtransition");
var QMatrix = (function () {
    function QMatrix(hashFunction) {
        this.hashFunction = hashFunction;
        this.actions = new Map();
        this.states = new Map();
        this.transitions = [];
    }
    QMatrix.prototype.registerAction = function (action, data) {
        this.actions.set(typeof action === "string" ? action : action.Name, typeof action === "string" ? new qaction_1.QAction(action, data) : action);
    };
    QMatrix.prototype.registerState = function (data, reward) {
        if (reward === void 0) { reward = 0.; }
        if (!this.hashFunction)
            throw new Error("Unable to register a state without a hash function.");
        if (this.states.has(this.hash(data)))
            return this.states.get(this.hash(data));
        var state = new qstate_1.QState(data, reward);
        this.states.set(this.hash(state.Data), state);
        return state;
    };
    QMatrix.prototype.registerTransition = function (action, from, to, oppositeActionName) {
        var qaction = this.action(action);
        var transition = new qtransition_1.QTransition(from, to, qaction);
        from.setTransition(qaction, transition);
        this.transitions.push(transition);
        if (oppositeActionName) {
            transition = new qtransition_1.QTransition(to, from, qaction);
            to.setTransition(this.action(oppositeActionName), transition);
            this.transitions.push(transition);
        }
        return transition;
    };
    QMatrix.prototype.updateTransition = function (id, to) {
        var trans = this.transitions.find(function (t) { return t.Id === id; });
        if (trans) {
            trans.To = to;
            return trans;
        }
        return undefined;
    };
    QMatrix.prototype.action = function (name) {
        return this.actions.get(name);
    };
    QMatrix.prototype.hash = function (data) {
        try {
            return this.hashFunction(data);
        }
        catch (exception) {
            console.error("Unable to hash the object, are you sure you gave a defined QStateData ? : " + exception);
            console.error("Falling on default hash func ... [ PLEASE PROVIDE A HASH FUNCTION ]");
            return QMatrix.defaultHash(data);
        }
    };
    QMatrix.defaultHash = function (data) {
        return JSON.stringify(data);
    };
    QMatrix.prototype.getStateFromData = function (data) {
        return this.states.get(this.hash(data));
    };
    QMatrix.prototype.exists = function (data) {
        return this.states.has(this.hash(data));
    };
    QMatrix.prototype.checkAndGetState = function (state) {
        if (typeof state === "string") {
            state = this.states.get(state);
        }
        else if (!(state instanceof qstate_1.QState)) {
            state = this.states.get(this.hash(state));
        }
        return state;
    };
    QMatrix.prototype.setStateAsInitial = function (state) {
        this.initialState = this.checkAndGetState(state);
        return this.initialState !== undefined;
    };
    QMatrix.prototype.setStateAsFinal = function (state) {
        var final = this.checkAndGetState(state);
        if (final !== undefined && !final.Final) {
            final.Final = true;
            return true;
        }
        return false;
    };
    QMatrix.prototype.removeStateFromFinals = function (state) {
        var temps = this.checkAndGetState(state);
        if (temps !== undefined && temps.Final) {
            temps.Final = false;
            return true;
        }
        else {
            return false;
        }
    };
    QMatrix.prototype.reset = function () {
        this.transitions = [];
        this.states.clear();
        this.actions.clear();
    };
    QMatrix.prototype.resetTransitions = function () {
        this.transitions.forEach(function (t) { return t.Q = 0.0; });
    };
    Object.defineProperty(QMatrix.prototype, "InitialState", {
        get: function () {
            return this.initialState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QMatrix.prototype, "FinalStates", {
        get: function () {
            return Array.from(this.states.values()).filter(function (state) { return state.Final; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QMatrix.prototype, "HashFunction", {
        get: function () {
            return this.hashFunction;
        },
        set: function (func) {
            this.hashFunction = func;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QMatrix.prototype, "States", {
        get: function () {
            return Array.from(this.states.values());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QMatrix.prototype, "Actions", {
        get: function () {
            return Array.from(this.actions.values());
        },
        enumerable: true,
        configurable: true
    });
    QMatrix.prototype.getGraphData = function () {
        var nodes = this.States.map(function (s) { return ({
            id: s.Id,
            label: JSON.stringify(s.Data),
            color: getColor(s.Reward)
        }); });
        var edges = this.transitions
            .filter(function (t) { return t.To && t.From; })
            .map(function (t) { return ({
            id: t.Id,
            to: t.To.Id,
            from: t.From.Id,
            label: t.Q + "-" + t.Action.Name,
            color: getColor(t.Q),
            arrows: 'to'
        }); });
        return { nodes: nodes, edges: edges };
    };
    return QMatrix;
}());
exports.QMatrix = QMatrix;
function getColor(value) {
    var hue = parseInt(((1 - value) * 120).toString(10));
    var h = hue;
    var s = 1;
    var l = 0.5;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(h / 60 % 2 - 1));
    var m = l - c / 2;
    var values = hue < 60 ? [c, x, 0] : [x, c, 0];
    var rgb = [(values[0] + m) * 255, (values[1] + m) * 255, (values[2] + m) * 255];
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}
