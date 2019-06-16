import { Academy } from "../academy";
export declare class LearningDataLogger {
    private academy;
    private parent;
    private tables;
    private memory;
    constructor(element: string | HTMLElement, academy: Academy);
    createMemoryTable(): void;
    createTeacherTable(teacherName: string): void;
    updateTables(showMemory?: boolean): void;
    dispose(): void;
    static tableStyle(table: HTMLTableElement): void;
}
