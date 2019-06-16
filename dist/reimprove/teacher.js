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
var DEFAULT_TEACHING_CONFIG = {
    lessonLength: 1000,
    lessonsQuantity: 30,
    lessonsWithRandom: 2,
    epsilon: 1,
    epsilonMin: 0.05,
    epsilonDecay: 0.95,
    gamma: 0.9,
    alpha: 1
};
var TeachingState;
(function (TeachingState) {
    TeachingState[TeachingState["EXPERIENCING"] = 0] = "EXPERIENCING";
    TeachingState[TeachingState["LEARNING"] = 1] = "LEARNING";
    TeachingState[TeachingState["TESTING"] = 2] = "TESTING";
    TeachingState[TeachingState["NONE"] = -1] = "NONE";
    TeachingState[TeachingState["STOPPED"] = -2] = "STOPPED";
})(TeachingState = exports.TeachingState || (exports.TeachingState = {}));
var Teacher = (function () {
    function Teacher(config, name) {
        this.config = __assign({}, DEFAULT_TEACHING_CONFIG, config);
        this.agents = new Set();
        this.currentLessonLength = 0;
        this.lessonsTaught = 0;
        this.state = TeachingState.NONE;
        this.currentEpsilon = this.config.epsilon;
        this.onLessonEnded = null;
        this.onLearningLessonEnded = null;
        this.onTeachingEnded = null;
        this.name = name;
    }
    Teacher.prototype.affectStudent = function (agent) {
        this.agents.add(agent);
    };
    Teacher.prototype.removeStudent = function (agent) {
        return this.agents.delete(agent);
    };
    Teacher.prototype.start = function () {
        this.lessonsTaught = 0;
        this.currentLessonLength = 0;
        this.state = TeachingState.EXPERIENCING;
    };
    Teacher.prototype.teach = function (inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var actions, _i, _a, agent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.state == TeachingState.STOPPED)
                            return [2, null];
                        if (this.state == TeachingState.NONE) {
                            this.start();
                        }
                        actions = new Map();
                        if (!(this.state == TeachingState.TESTING)) return [3, 1];
                        this.agents.forEach(function (a) { return actions.set(a.Name, a.infer(inputs, _this.config.epsilonMin, false)); });
                        return [3, 7];
                    case 1:
                        this.currentLessonLength += 1;
                        if (this.currentLessonLength >= this.config.lessonLength)
                            this.state = TeachingState.LEARNING;
                        if (!(this.state == TeachingState.EXPERIENCING)) return [3, 2];
                        this.agents.forEach(function (a) { return actions.set(a.Name, a.listen(inputs, _this.currentEpsilon)); });
                        return [3, 7];
                    case 2:
                        if (!(this.state == TeachingState.LEARNING)) return [3, 7];
                        if (this.onLessonEnded)
                            this.onLessonEnded(this.name, this.lessonsTaught);
                        _i = 0, _a = Array.from(this.agents.keys());
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3, 6];
                        agent = _a[_i];
                        return [4, agent.learn(this.config.gamma, this.config.alpha)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3, 3];
                    case 6:
                        this.updateParameters();
                        this.lessonsTaught += 1;
                        this.currentLessonLength = 0;
                        if (this.lessonsTaught >= this.config.lessonsQuantity) {
                            this.state = TeachingState.TESTING;
                            if (this.onTeachingEnded)
                                this.onTeachingEnded(this.name);
                        }
                        else {
                            this.state = TeachingState.EXPERIENCING;
                        }
                        this.agents.forEach(function (a) { return actions.set(a.Name, a.listen(inputs, _this.currentEpsilon)); });
                        if (this.onLearningLessonEnded)
                            this.onLearningLessonEnded(this.name);
                        _b.label = 7;
                    case 7:
                        this.agents.forEach(function (a) { return a.setReward(0.); });
                        return [2, actions];
                }
            });
        });
    };
    Teacher.prototype.stopTeaching = function () {
        this.state = TeachingState.TESTING;
    };
    Teacher.prototype.startTeaching = function () {
        if (this.lessonsTaught < this.config.lessonsQuantity)
            this.state = TeachingState.EXPERIENCING;
    };
    Teacher.prototype.updateParameters = function () {
        if (this.lessonsTaught > this.config.lessonsWithRandom && this.currentEpsilon > this.config.epsilonMin) {
            this.currentEpsilon *= this.config.epsilonDecay;
            if (this.currentEpsilon < this.config.epsilonMin)
                this.currentEpsilon = this.config.epsilonMin;
        }
    };
    Teacher.prototype.getData = function () {
        var data = [];
        this.agents.forEach(function (agent) { return data.push(agent.getTrackingInformation()); });
        return {
            epsilon: this.currentEpsilon,
            gamma: this.config.gamma,
            lessonNumber: this.lessonsTaught,
            currentLessonLength: this.currentLessonLength,
            maxLessons: this.config.lessonsQuantity,
            name: this.name,
            students: data
        };
    };
    Teacher.prototype.resetLesson = function () {
        this.currentLessonLength = 0;
        this.state = TeachingState.EXPERIENCING;
    };
    Teacher.prototype.reset = function () {
        this.lessonsTaught = 0;
        this.currentLessonLength = 0;
        this.state = TeachingState.NONE;
    };
    Teacher.prototype.stop = function () {
        this.state = TeachingState.STOPPED;
    };
    Object.defineProperty(Teacher.prototype, "OnLearningLessonEnded", {
        set: function (callback) {
            this.onLearningLessonEnded = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Teacher.prototype, "OnLessonEnded", {
        set: function (callback) {
            this.onLessonEnded = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Teacher.prototype, "OnTeachingEnded", {
        set: function (callback) {
            this.onTeachingEnded = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Teacher.prototype, "Name", {
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Teacher.prototype, "State", {
        get: function () {
            return this.state;
        },
        enumerable: true,
        configurable: true
    });
    return Teacher;
}());
exports.Teacher = Teacher;
