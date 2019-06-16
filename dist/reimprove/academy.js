"use strict";
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
var dqagent_1 = require("./algorithms/deepq/dqagent");
var teacher_1 = require("./teacher");
var uuid_1 = require("uuid");
var learning_data_logger_1 = require("./misc/learning_data_logger");
var DEFAULT_ACADEMY_CONFIG = {
    parentLogsElement: null,
    agentsLogs: false,
    memoryLogs: false
};
var Academy = (function () {
    function Academy(config) {
        this.config = __assign({}, DEFAULT_ACADEMY_CONFIG, config);
        this.agents = new Map();
        this.teachers = new Map();
        this.assigments = new Map();
        if (this.config.parentLogsElement) {
            this.createLogger(this.config.parentLogsElement);
        }
    }
    Academy.prototype.addAgent = function (config, name) {
        var agent = new dqagent_1.DQAgent(config.model, config.agentConfig, name);
        if (!agent.Name)
            agent.Name = uuid_1.v4();
        this.agents.set(agent.Name, agent);
        return agent;
    };
    Academy.prototype.addTeacher = function (config, name) {
        var teacher = new teacher_1.Teacher(config, name);
        if (!teacher.Name)
            teacher.Name = uuid_1.v4();
        this.teachers.set(teacher.Name, teacher);
        return teacher.Name;
    };
    Academy.prototype.assignTeacherToAgent = function (agentName, teacherName) {
        if (!this.agents.has(agentName))
            throw new Error("No such agent has been registered");
        if (!this.teachers.has(teacherName))
            throw new Error("No such teacher has been registered");
        this.assigments.set(agentName, teacherName);
        this.teachers.get(teacherName).affectStudent(this.agents.get(agentName));
    };
    Academy.prototype.step = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var actions, finalInput, _i, finalInput_1, input, agentsActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actions = new Map();
                        finalInput = inputs instanceof Array ? inputs : [inputs];
                        _i = 0, finalInput_1 = finalInput;
                        _a.label = 1;
                    case 1:
                        if (!(_i < finalInput_1.length)) return [3, 4];
                        input = finalInput_1[_i];
                        if (!this.teachers.has(input.teacherName)) {
                            throw new Error("No teacher has name " + input.teacherName);
                        }
                        return [4, this.teachers
                                .get(input.teacherName)
                                .teach(input.agentsInput)];
                    case 2:
                        agentsActions = _a.sent();
                        agentsActions.forEach(function (value, key) {
                            if (actions.has(key))
                                throw new Error("Dqagent " + key + " has already registered an action.");
                            actions.set(key, value);
                        });
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        if (this.logger)
                            this.logger.updateTables(true);
                        return [2, actions];
                }
            });
        });
    };
    Academy.prototype.addRewardToAgent = function (name, reward) {
        if (this.agents.has(name))
            this.agents.get(name).addReward(reward);
    };
    Academy.prototype.setRewardOfAgent = function (name, reward) {
        if (this.agents.has(name))
            this.agents.get(name).setReward(reward);
    };
    Academy.prototype.OnLearningLessonEnded = function (teacherName, callback) {
        if (this.teachers.has(teacherName))
            this.teachers.get(teacherName).onLearningLessonEnded = callback;
    };
    Academy.prototype.OnLessonEnded = function (teacherName, callback) {
        if (this.teachers.has(teacherName))
            this.teachers.get(teacherName).onLessonEnded = callback;
    };
    Academy.prototype.OnTeachingEnded = function (teacherName, callback) {
        if (this.teachers.has(teacherName))
            this.teachers.get(teacherName).onTeachingEnded = callback;
    };
    Academy.prototype.resetTeachersAndAgents = function () {
        this.teachers.forEach(function (t) { return t.reset(); });
        this.agents.forEach(function (a) { return a.reset(); });
    };
    Academy.prototype.reset = function () {
        this.resetTeachersAndAgents();
        this.teachers.clear();
        this.agents.clear();
    };
    Academy.prototype.resetTeacherLesson = function (teacherName) {
        this.teachers.get(teacherName).resetLesson();
    };
    Object.defineProperty(Academy.prototype, "Teachers", {
        get: function () {
            return Array.from(this.teachers.keys());
        },
        enumerable: true,
        configurable: true
    });
    Academy.prototype.getTeacherData = function (name) {
        return this.teachers.get(name).getData();
    };
    Academy.prototype.createLogger = function (parent) {
        if (this.logger)
            this.logger.dispose();
        this.config.parentLogsElement = parent;
        this.logger = new learning_data_logger_1.LearningDataLogger(parent, this);
    };
    Academy.prototype.toggleLogs = function (memory) {
        if (memory === void 0) { memory = false; }
        var status = this.config.agentsLogs;
        this.config.agentsLogs = !status;
        if (status)
            this.config.memoryLogs = memory;
    };
    Academy.prototype.toggleTeaching = function (teacher, toggle) {
        if (toggle === true)
            this.teachers.get(teacher).startTeaching();
        else
            this.teachers.get(teacher).stopTeaching();
    };
    return Academy;
}());
exports.Academy = Academy;
