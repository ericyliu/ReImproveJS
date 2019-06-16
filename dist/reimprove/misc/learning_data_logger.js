"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var LearningDataLogger = (function () {
    function LearningDataLogger(element, academy) {
        var _this = this;
        this.academy = academy;
        if (typeof element == "string") {
            this.parent = document.getElementById(element);
        }
        else {
            this.parent = element;
        }
        this.tables = [];
        this.academy.Teachers.forEach(function (name) { return _this.createTeacherTable(name); });
        this.tables.forEach(function (val) { return _this.parent.appendChild(val.table); });
        this.createMemoryTable();
        this.parent.appendChild(this.memory);
    }
    LearningDataLogger.prototype.createMemoryTable = function () {
        this.memory = document.createElement('table');
        var thead = this.memory.createTHead();
        var tbody = this.memory.createTBody();
        var hrow = thead.insertRow(0);
        hrow.insertCell(0).innerHTML = "Bytes allocated (undisposed)";
        hrow.insertCell(1).innerHTML = "Unique tensors allocated";
        hrow.insertCell(2).innerHTML = "Data buffers allocated";
        hrow.insertCell(3).innerHTML = "Unreliable";
        var brow = tbody.insertRow(0);
        brow.insertCell(0).innerHTML = "";
        brow.insertCell(1).innerHTML = "";
        brow.insertCell(2).innerHTML = "";
        brow.insertCell(3).innerHTML = "";
        LearningDataLogger.tableStyle(this.memory);
    };
    LearningDataLogger.prototype.createTeacherTable = function (teacherName) {
        var table = document.createElement('table');
        var thead = table.createTHead();
        var tbody = table.createTBody();
        var hrow = thead.insertRow(0);
        hrow.insertCell(0).innerHTML = "Name";
        hrow.insertCell(1).innerHTML = "Q loss average";
        hrow.insertCell(2).innerHTML = "Average reward";
        hrow.insertCell(3).innerHTML = "Epsilon";
        hrow.insertCell(4).innerHTML = "Lesson number";
        var studentsQuantity = this.academy.getTeacherData(teacherName).students.length;
        for (var i = 0; i < studentsQuantity; ++i) {
            var brow = tbody.insertRow(i);
            brow.insertCell(0).innerHTML = "";
            brow.insertCell(1).innerHTML = "";
            brow.insertCell(2).innerHTML = "";
            brow.insertCell(3).innerHTML = "";
            brow.insertCell(4).innerHTML = "";
        }
        LearningDataLogger.tableStyle(table);
        this.tables.push({ teacherName: teacherName, table: table });
    };
    LearningDataLogger.prototype.updateTables = function (showMemory) {
        var _this = this;
        if (showMemory === void 0) { showMemory = false; }
        this.tables.forEach(function (table) {
            var tData = _this.academy.getTeacherData(table.teacherName);
            tData.students.forEach(function (data, index) {
                table.table.tBodies.item(0).rows.item(index).cells.item(0).innerHTML = data.name;
                table.table.tBodies.item(0).rows.item(index).cells.item(1).innerHTML = data.averageLoss.toString().substr(0, 5);
                table.table.tBodies.item(0).rows.item(index).cells.item(2).innerHTML = data.averageReward.toString().substr(0, 5);
                table.table.tBodies.item(0).rows.item(index).cells.item(3).innerHTML = tData.epsilon.toString().substr(0, 5);
                table.table.tBodies.item(0).rows.item(index).cells.item(4).innerHTML = tData.lessonNumber.toString();
            });
        });
        if (showMemory) {
            var tfMemory = tfjs_core_1.memory();
            this.memory.tBodies.item(0).rows.item(0).cells.item(0).innerHTML = tfMemory.numBytes.toString();
            this.memory.tBodies.item(0).rows.item(0).cells.item(1).innerHTML = tfMemory.numTensors.toString();
            this.memory.tBodies.item(0).rows.item(0).cells.item(2).innerHTML = tfMemory.numDataBuffers.toString();
            this.memory.tBodies.item(0).rows.item(0).cells.item(3).innerHTML = tfMemory.unreliable.toString();
        }
    };
    LearningDataLogger.prototype.dispose = function () {
        var _this = this;
        this.tables.forEach(function (table) {
            _this.parent.removeChild(table.table);
        });
    };
    LearningDataLogger.tableStyle = function (table) {
        table.style.border = "medium solid #6495ed";
        table.style.borderCollapse = "collapse";
        table.tHead.style.fontFamily = "monospace";
        table.tHead.style.border = "thin solid #6495ed";
        table.tHead.style.padding = "5px";
        table.tHead.style.backgroundColor = "#d0e3fa";
        table.tHead.style.textAlign = "center";
        table.tHead.style.margin = "8px";
        for (var i = 0; i < table.tBodies.length; ++i) {
            var item = table.tBodies.item(i);
            item.style.fontFamily = "sans-serif";
            item.style.border = "thin solid #6495ed";
            item.style.padding = "5px";
            item.style.textAlign = "center";
            item.style.backgroundColor = "#ffffff";
            item.style.margin = "3px";
        }
    };
    return LearningDataLogger;
}());
exports.LearningDataLogger = LearningDataLogger;
