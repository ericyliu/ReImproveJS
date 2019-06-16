import { DQAgent } from "./algorithms/deepq/dqagent";
import { AgentTrackingInformation } from "./algorithms/agent_config";
export interface TeachingConfig {
    lessonLength?: number;
    lessonsQuantity?: number;
    lessonsWithRandom?: number;
    gamma?: number;
    epsilon?: number;
    epsilonDecay?: number;
    epsilonMin?: number;
    alpha?: number;
}
export declare enum TeachingState {
    EXPERIENCING = 0,
    LEARNING = 1,
    TESTING = 2,
    NONE = -1,
    STOPPED = -2,
}
export interface TeacherTrackingInformation {
    name: string;
    gamma: number;
    epsilon: number;
    currentLessonLength: number;
    lessonNumber: number;
    maxLessons: number;
    students: AgentTrackingInformation[];
}
export declare class Teacher {
    name: string;
    config: TeachingConfig;
    state: TeachingState;
    agents: Set<DQAgent>;
    currentLessonLength: number;
    lessonsTaught: number;
    onLearningLessonEnded: (teacher: string) => void;
    onLessonEnded: (teacher: string, lessonNumber: number) => void;
    onTeachingEnded: (teacher: string) => void;
    currentEpsilon: number;
    constructor(config?: TeachingConfig, name?: string);
    affectStudent(agent: DQAgent): void;
    removeStudent(agent: DQAgent): boolean;
    start(): void;
    teach(inputs: number[]): Promise<Map<string, number>>;
    stopTeaching(): void;
    startTeaching(): void;
    updateParameters(): void;
    getData(): TeacherTrackingInformation;
    resetLesson(): void;
    reset(): void;
    stop(): void;
    OnLearningLessonEnded: (teacher: string) => void;
    OnLessonEnded: (teacher: string, lessonNumber: number) => void;
    OnTeachingEnded: (teacher: string) => void;
    Name: string;
    readonly State: TeachingState;
}
