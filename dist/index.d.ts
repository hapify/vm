interface HapifyVMOptions {
    timeout?: number;
    allowAnyOutput?: boolean;
}
export declare class OutputError extends Error {
    code: number;
    name: string;
}
export declare class EvaluationError extends Error {
    code: number;
    name: string;
    lineNumber: number;
    columnNumber: number;
    details: string;
}
export declare class TimeoutError extends Error {
    code: number;
    name: string;
}
export declare class IntegrityError extends Error {
    code: number;
    name: string;
}
export declare class HapifyVM {
    /** Default options */
    private defaultOptions;
    /** Actual options */
    private options;
    /** Built-in objects to remove from sandbox */
    private forbiddenObjects;
    /** RegEx used to extract error's line & column */
    private stackRegex;
    /** Constructor */
    constructor(options?: HapifyVMOptions);
    /** Wrap content in auto-executable function */
    private wrap;
    /** Execute content */
    run(content: string, context: {
        [key: string]: any;
    }): string | any;
}
export {};
