
import { VM } from 'vm2';

const SECOND = 1000;

interface HapifyVMOptions {
	timeout?: number;
}

export class OutputError extends Error {
	code = 6001;
	name = 'VmOutputError';
}
export class EvaluationError extends Error {
	code = 6002;
	name = 'VmEvaluationError';
	lineNumber: number = null;
	columnNumber: number = null;
	details: string = null;
}
export class TimeoutError extends Error {
	code = 6003;
	name = 'VmTimeoutError';
}
export class IntegrityError extends Error {
	code = 6004;
	name = 'VmIntegrityError';
}

export class HapifyVM {

	/** Default options */
	private defaultOptions: HapifyVMOptions = {
		timeout: SECOND
	};
	/** Actual options */
	private options: HapifyVMOptions;
	/** Built-in objects to remove from sandbox */
	private forbiddenObjects: {
		console: undefined;
	};
	/** RegEx used to extract error's line & column */
	private stackRegex = /vm\.js:([0-9]+):([0-9]+)/m;

	/** Constructor */
	constructor(options: HapifyVMOptions = {}) {
		this.options = Object.assign({}, this.defaultOptions, options);
	}

	/** Wrap content in auto-executable function */
	private wrap(content: string): string {
		return `(function() {\n${content}\n })()`;
	}

	/** Execute content */
	run(content: string, context: { [key: string]: any }): string {

		let result;

		const vm = new VM({
			timeout: this.options.timeout,
			sandbox: Object.assign(context, this.forbiddenObjects),
			compiler: "javascript",
			eval: false,
			wasm: false
		});
		const wrappedContent = this.wrap(content);

		try {
			result = vm.run(wrappedContent);
		} catch (error) {

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

		if (typeof result !== "undefined" && typeof result !== "string") {
			throw new OutputError('Must return a string');
		}

		return result;
	}
}
