"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var TypedWindow = (function () {
    function TypedWindow(size, minSize, nullValue) {
        this.size = size;
        this.minSize = minSize;
        this.nullValue = nullValue;
        this.window = [];
    }
    TypedWindow.prototype.add = function (value) {
        if (value == this.nullValue)
            return;
        this.window.push(value);
        if (this.window.length > this.size)
            this.window.shift();
    };
    TypedWindow.prototype.mean = function () {
        if (this.window.length < this.minSize) {
            return -1;
        }
        else {
            return lodash_1.mean(this.window);
        }
    };
    Object.defineProperty(TypedWindow.prototype, "Window", {
        get: function () {
            return this.window;
        },
        enumerable: true,
        configurable: true
    });
    return TypedWindow;
}());
exports.TypedWindow = TypedWindow;
