"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm2_1 = require("vm2");
const SECOND = 1000;
class OutputError extends Error {
    constructor() {
        super(...arguments);
        this.code = 6001;
        this.name = 'VmOutputError';
    }
}
exports.OutputError = OutputError;
class EvaluationError extends Error {
    constructor() {
        super(...arguments);
        this.code = 6002;
        this.name = 'VmEvaluationError';
        this.lineNumber = null;
        this.columnNumber = null;
        this.details = null;
    }
}
exports.EvaluationError = EvaluationError;
class TimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.code = 6003;
        this.name = 'VmTimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
class IntegrityError extends Error {
    constructor() {
        super(...arguments);
        this.code = 6004;
        this.name = 'VmIntegrityError';
    }
}
exports.IntegrityError = IntegrityError;
class HapifyVM {
    /** Constructor */
    constructor(options = {}) {
        /** Default options */
        this.defaultOptions = {
            timeout: SECOND,
            allowAnyOutput: false
        };
        /** RegEx used to extract error's line & column */
        this.stackRegex = /vm\.js:([0-9]+):([0-9]+)/m;
        this.options = Object.assign({}, this.defaultOptions, options);
    }
    /** Wrap content in auto-executable function */
    wrap(content) {
        return `(function() {\n${content}\n })()`;
    }
    /** Execute content */
    run(content, context) {
        let result;
        const vm = new vm2_1.VM({
            timeout: this.options.timeout,
            sandbox: Object.assign(context, this.forbiddenObjects),
            compiler: 'javascript',
            eval: false,
            wasm: false
        });
        const wrappedContent = this.wrap(content);
        try {
            result = vm.run(wrappedContent);
        }
        catch (error) {
            // Check error
            if (typeof error.message !== 'string' || typeof error.stack !== 'string') {
                throw new IntegrityError('Invalid error');
            }
            if (error.message === 'Script execution timed out.') {
                throw new TimeoutError(`Script execution timed out. (${this.options.timeout}ms)`);
            }
            // Parse error
            const evalError = new EvaluationError(error.message);
            const matches = this.stackRegex.exec(error.stack);
            if (matches) {
                const lineNumber = Number(matches[1]);
                const columnNumber = Number(matches[2]);
                evalError.details = `Error: ${evalError.message}. Line: ${lineNumber}, Column: ${columnNumber}`;
                evalError.lineNumber = lineNumber - 1; // Minus 1 for wrapper
                evalError.columnNumber = columnNumber;
            }
            throw evalError;
        }
        if (!this.options.allowAnyOutput && typeof result !== 'undefined' && typeof result !== 'string') {
            throw new OutputError('Must return a string');
        }
        return result;
    }
}
exports.HapifyVM = HapifyVM;
//# sourceMappingURL=index.js.map