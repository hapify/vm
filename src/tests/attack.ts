import {expect, fail} from '@hapi/code';
import * as Lab from '@hapi/lab';
const lab = (exports.lab = Lab.script());

import { HapifyVM } from '../index';

lab.test('process accesses', async () => {
	const script = 'process.exit();';
	expect(() => new HapifyVM().run(script, {})).to.throw('process is not defined');
});
lab.test('require accesses 1', async () => {
	const script = 'require("http");';
	expect(() => new HapifyVM().run(script, {})).to.throw('require is not defined');
});
lab.test('require accesses 2', async () => {
	const script = 'models.constructor.constructor("return process.mainModule.require")()("http")';
	expect(() => new HapifyVM().run(script, { models: {} })).to.throw('Code generation from strings disallowed for this context');
});
lab.test('global values', async () => {
	const script = 'return JSON.stringify(Object.keys(global));';
	const result = JSON.parse(new HapifyVM().run(script, {}));
	expect(result).to.equal(['VMError', 'Proxy', 'Buffer']);
});
lab.test('process deep accesses', async () => {
	const script = 'models.constructor.constructor("return { process }")().exit()';
	expect(() => new HapifyVM().run(script, { models: {} })).to.throw('Code generation from strings disallowed for this context');
});
lab.test('process deep accesses with this', async () => {
	const script = 'this.constructor.constructor("return { process }")().exit()';
	expect(() => new HapifyVM().run(script, {})).to.throw('Code generation from strings disallowed for this context');
});

lab.test('alter console 1', async () => {
	const script = 'console = undefined; return "";';
	new HapifyVM().run(script, {});
	expect(console).to.not.be.undefined();
});
lab.test('alter console 2', async () => {
	const script = 'console.log = function() { return "trojan" }; return "";';
	new HapifyVM().run(script, {});
	expect(console.log()).to.not.be.a.string();
});

lab.test('return fake string', async () => {
	const script = 'return { toString: function() { /* Bad function */ } };';
	expect(() => new HapifyVM().run(script, {})).to.throw('Must return a string');
});

lab.test('throw evil error 1', async () => {
	const script = 'throw { message: { toString: function() { /* Bad function */ } } };';
	expect(() => new HapifyVM().run(script, {})).to.throw('Invalid error');
});
lab.test('throw evil error 2', async () => {
	const script = 'throw { stack: { toString: function() { /* Bad function */ } } };';
	try {
		new HapifyVM().run(script, {});
		fail('Should throw an error');
	} catch (e) {
		expect(e.name).to.equal('VmIntegrityError');
		expect(e.code).to.equal(6004);
		expect(e.message).to.equal('Invalid error');
	}
});
