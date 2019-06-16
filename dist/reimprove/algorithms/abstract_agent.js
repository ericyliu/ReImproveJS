"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_AGENT_CONFIG = {
    memorySize: 30000
};
var AbstractAgent = (function () {
    function AbstractAgent(agentConfig, name) {
        this.name = name;
        this.agentConfig = __assign({}, DEFAULT_AGENT_CONFIG, agentConfig);
    }
    AbstractAgent.prototype.setAgentConfig = function (config) { this.agentConfig = config; };
    Object.defineProperty(AbstractAgent.prototype, "Name", {
        get: function () { return this.name; },
        set: function (name) { this.name = name; },
        enumerable: true,
        configurable: true
    });
    return AbstractAgent;
}());
exports.AbstractAgent = AbstractAgent;
