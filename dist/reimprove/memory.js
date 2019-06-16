"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Memory = (function () {
    function Memory(config) {
        this.config = config;
        this.memory = new Array(this.config.size);
        this.currentSize = 0;
    }
    Memory.prototype.remember = function (memento, replaceIfFull) {
        if (replaceIfFull === void 0) { replaceIfFull = true; }
        memento.state.references += 1;
        memento.nextState.references += 1;
        if (this.currentSize < this.config.size) {
            this.memory[this.currentSize++] = memento;
        }
        else if (replaceIfFull) {
            var randPos = lodash_1.random(0, this.memory.length - 1);
            Memory.freeMemento(this.memory[randPos]);
            this.memory[randPos] = memento;
        }
    };
    Memory.prototype.sample = function (batchSize, unique) {
        if (unique === void 0) { unique = true; }
        var memslice = this.memory.slice(0, this.currentSize);
        if (unique)
            return lodash_1.sampleSize(memslice, batchSize);
        else
            return lodash_1.range(batchSize).map(function () { return lodash_1.sample(memslice); });
    };
    Object.defineProperty(Memory.prototype, "CurrentSize", {
        get: function () {
            return this.currentSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Memory.prototype, "Size", {
        get: function () {
            return this.memory.length;
        },
        enumerable: true,
        configurable: true
    });
    Memory.freeMemento = function (memento) {
        memento.nextState.references -= 1;
        memento.state.references -= 1;
        if (memento.nextState.references <= 0)
            memento.nextState.tensor.dispose();
        if (memento.state.references <= 0)
            memento.state.tensor.dispose();
    };
    Memory.prototype.reset = function () {
        this.memory.forEach(function (memento) {
            memento.state.tensor.dispose();
            memento.nextState.tensor.dispose();
        });
        this.memory = new Array(this.config.size);
        this.currentSize = 0;
    };
    Memory.prototype.merge = function (other) {
        var _this = this;
        other.memory.forEach(function (memento) { return _this.remember(memento); });
    };
    return Memory;
}());
exports.Memory = Memory;
