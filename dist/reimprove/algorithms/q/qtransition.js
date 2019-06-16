"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QTransition = (function () {
    function QTransition(from, to, action) {
        this.from = from;
        this.to = to;
        this.action = action;
        this.QValue = 0;
        this.id = QTransition.transitionId++;
    }
    Object.defineProperty(QTransition.prototype, "Q", {
        get: function () { return this.QValue; },
        set: function (qvalue) { this.QValue = qvalue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QTransition.prototype, "From", {
        get: function () { return this.from; },
        set: function (state) { this.from = state; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QTransition.prototype, "To", {
        get: function () { return this.to; },
        set: function (state) { this.to = state; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QTransition.prototype, "Action", {
        get: function () { return this.action; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QTransition.prototype, "Id", {
        get: function () { return this.id; },
        enumerable: true,
        configurable: true
    });
    QTransition.transitionId = 0;
    return QTransition;
}());
exports.QTransition = QTransition;
