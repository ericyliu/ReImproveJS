import { TeacherTrackingInformation, TeachingConfig } from "./teacher";
import { Model } from "./model";
import { DQAgentConfig } from "./algorithms/agent_config";
export interface AcademyConfig {
    parentLogsElement: HTMLElement;
    agentsLogs: boolean;
    memoryLogs: boolean;
}
export interface AcademyStepInput {
    teacherName: string;
    agentsInput: number[];
}
export interface BuildAgentConfig {
    model: Model;
    agentConfig?: DQAgentConfig;
}
export declare class Academy {
    private agents;
    private teachers;
    private assigments;
    private logger;
    private config;
    constructor(config?: AcademyConfig);
    addAgent(config: BuildAgentConfig, name?: string): string;
    addTeacher(config?: TeachingConfig, name?: string): string;
    assignTeacherToAgent(agentName: string, teacherName: string): void;
    step(inputs: AcademyStepInput[] | AcademyStepInput): Promise<Map<string, number>>;
    addRewardToAgent(name: string, reward: number): void;
    setRewardOfAgent(name: string, reward: number): void;
    OnLearningLessonEnded(teacherName: string, callback: (teacher: string) => void): void;
    OnLessonEnded(teacherName: string, callback: (teacher: string, lessonNumber: number) => void): void;
    OnTeachingEnded(teacherName: string, callback: (teacher: string) => void): void;
    resetTeachersAndAgents(): void;
    reset(): void;
    resetTeacherLesson(teacherName: string): void;
    readonly Teachers: string[];
    getTeacherData(name: string): TeacherTrackingInformation;
    createLogger(parent: HTMLElement): void;
    toggleLogs(memory?: boolean): void;
    toggleTeaching(teacher: string, toggle: boolean): void;
}
