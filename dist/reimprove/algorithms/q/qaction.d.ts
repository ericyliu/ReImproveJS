export interface QActionData {
    [key: string]: any;
}
export declare class QAction {
    private name;
    private data;
    constructor(name: string, data?: QActionData);
    Data: QActionData;
    readonly Name: string;
}
