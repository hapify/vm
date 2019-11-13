
import { VM } from 'vm2';

const SECOND = 1000;

interface HapifyVMOptions {
	timeout?: number;
}

export class EvaluationError extends Error {
	name = 'EvaluationError';
	lineNumber: number = null;
	columnNumber: number = null;
	details: string = null;
}

export class HapifyVM {

	/** Default options */
	private defaultOptions: HapifyVMOptions = {
		timeout: SECOND
	};
	/** Actual options */
	private options: HapifyVMOptions;

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
		try {

			const vm = new VM({
				timeout: this.options.timeout,
				compiler: "javascript",
				eval: false,
				wasm: false
			});
			const result = vm.run(this.wrap(content));

			if (typeof result !== "string") {
				throw new Error('Must return a string')
			}

			return result;

		} catch (error) {

			console.log(error);

			// if (error.message === 'Script execution timed out.') {
			// 	throw new TimeoutError(`Template processing timed out (${Config.Generator.timeout}ms)`);
			// }
			// // Format error
			// const { lineNumber, columnNumber } = ErrorStackParser.parse(error)[0];
			// const evalError = new EvaluationError(error.message);
			// evalError.details = `Error: ${evalError.message}. Line: ${lineNumber}, Column: ${columnNumber}`;
			// evalError.lineNumber = lineNumber;
			// evalError.columnNumber = columnNumber;
			// throw evalError;
		}
	}
}
