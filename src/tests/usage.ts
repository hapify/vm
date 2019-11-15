import { expect, fail } from '@hapi/code';
import * as Lab from '@hapi/lab';
const lab = (exports.lab = Lab.script());

import { HapifyVM } from '../index';

lab.test('normal', async () => {
	expect(new HapifyVM().run('return new Date().toString();', {})).to.be.a.string();
});
lab.test('context access', async () => {
	expect(new HapifyVM().run('return value', { value: 'TheValue' })).to.equal('TheValue');
	expect(new HapifyVM().run('return value.prop', { value: { prop: 'TheValue' } })).to.equal('TheValue');
});
lab.test('no return', async () => {
	expect(new HapifyVM().run('return;', {})).to.be.undefined();
});

lab.test('return non string', async () => {
	try {
		new HapifyVM().run('return 1;', {});
		fail('Should throw an error');
	} catch (e) {
		expect(e.name).to.equal('VmOutputError');
		expect(e.code).to.equal(6001);
		expect(e.message).to.equal('Must return a string');
	}
});

lab.test('timeout', async () => {
	try {
		new HapifyVM({ timeout: 200 }).run('while(true) {}', {});
		fail('Should throw an error');
	} catch (e) {
		expect(e.name).to.equal('VmTimeoutError');
		expect(e.code).to.equal(6003);
		expect(e.message).to.equal('Script execution timed out. (200ms)');
	}
});

lab.test('evaluation error 1', async () => {
	try {
		new HapifyVM({ timeout: 200 }).run('/* comment */ a();', {});
		fail('Should throw an error');
	} catch (e) {
		expect(e.name).to.equal('VmEvaluationError');
		expect(e.code).to.equal(6002);
		expect(e.message).to.equal('a is not defined');
		expect(e.details).to.be.a.string();
		expect(e.lineNumber).to.equal(1);
		expect(e.columnNumber).to.equal(15);
	}
});

lab.test('evaluation error 2', async () => {
	try {
		new HapifyVM({ timeout: 200 }).run('function() { return 3;', {});
		fail('Should throw an error');
	} catch (e) {
		expect(e.name).to.equal('VmEvaluationError');
		expect(e.code).to.equal(6002);
		expect(e.message).to.equal('Unexpected token (');
		expect(e.details).to.be.a.string();
		expect(e.lineNumber).to.be.a.number();
		expect(e.columnNumber).to.be.a.number();
	}
});
