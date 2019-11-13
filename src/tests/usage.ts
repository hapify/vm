import { expect } from '@hapi/code';
import * as Lab from '@hapi/lab';
const lab = (exports.lab = Lab.script());

import { HapifyVM } from "../index";

lab.test('normal', async () => {
    expect(new HapifyVM().run('return new Date().toString();', {})).to.be.a.string();
});
lab.test('context access', async () => {
    expect(new HapifyVM().run('return value', { value: 'TheValue' })).to.equal('TheValue');
    expect(new HapifyVM().run('return value.prop', { value: { prop: 'TheValue' } })).to.equal('TheValue');
});
lab.test('no return', async () => {
    expect(new HapifyVM().run('return;', {})).to.be.undefined()
});

lab.test('return non string', async () => {
    expect(() => new HapifyVM().run('return 1;', {})).to.throw('Must return a string');
});

lab.test('timeout', async () => {
    expect(() => new HapifyVM({ timeout: 200 }).run('while(true) {}', {})).to.throw('Script execution timed out. (200ms)');
});

