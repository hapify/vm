
export function run(content: string, context: any) {
	try {
		const final = `(function() {\n${content}\n })()`;
		return new SaferEval(Object.assign(context, { console: undefined }), {
			filename: 'js-generator.js',
			timeout: Config.Generator.timeout,
			lineOffset: -3, // 1 from final + 2 from safer-eval
			contextCodeGeneration: {
				strings: false,
				wasm: false
			}
		}).runInContext(final);
	} catch (error) {
		if (error.message === 'Script execution timed out.') {
			throw new TimeoutError(`Template processing timed out (${Config.Generator.timeout}ms)`);
		}
		// Format error
		const { lineNumber, columnNumber } = ErrorStackParser.parse(error)[0];
		const evalError = new EvaluationError(error.message);
		evalError.details = `Error: ${evalError.message}. Line: ${lineNumber}, Column: ${columnNumber}`;
		evalError.lineNumber = lineNumber;
		evalError.columnNumber = columnNumber;
		throw evalError;
	}
}
