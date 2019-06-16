"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QAction = (function () {
    function QAction(name, data) {
        this.name = name;
        this.data = data;
    }
    Object.defineProperty(QAction.prototype, "Data", {
        get: function () {
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QAction.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    return QAction;
}());
exports.QAction = QAction;
