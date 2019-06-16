export declare class TypedWindow<T> {
    private size;
    private minSize;
    private nullValue;
    private window;
    constructor(size: number, minSize: number, nullValue: T);
    add(value: T): void;
    mean(): number;
    readonly Window: T[];
}
