"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("@hapi/code");
const Lab = __importStar(require("@hapi/lab"));
const lab = (exports.lab = Lab.script());
const index_1 = require("../index");
lab.test('normal', () => __awaiter(void 0, void 0, void 0, function* () {
    code_1.expect(new index_1.HapifyVM().run('return new Date().toString();', {})).to.be.a.string();
}));
lab.test('context access', () => __awaiter(void 0, void 0, void 0, function* () {
    code_1.expect(new index_1.HapifyVM().run('return value', { value: 'TheValue' })).to.equal('TheValue');
    code_1.expect(new index_1.HapifyVM().run('return value.prop', { value: { prop: 'TheValue' } })).to.equal('TheValue');
}));
lab.test('no return', () => __awaiter(void 0, void 0, void 0, function* () {
    code_1.expect(new index_1.HapifyVM().run('return;', {})).to.be.undefined();
}));
lab.test('return non string', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new index_1.HapifyVM().run('return 1;', {});
        code_1.fail('Should throw an error');
    }
    catch (e) {
        code_1.expect(e.name).to.equal('VmOutputError');
        code_1.expect(e.code).to.equal(6001);
        code_1.expect(e.message).to.equal('Must return a string');
    }
}));
lab.test('timeout', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new index_1.HapifyVM({ timeout: 200 }).run('while(true) {}', {});
        code_1.fail('Should throw an error');
    }
    catch (e) {
        code_1.expect(e.name).to.equal('VmTimeoutError');
        code_1.expect(e.code).to.equal(6003);
        code_1.expect(e.message).to.equal('Script execution timed out. (200ms)');
    }
}));
lab.test('evaluation error 1', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new index_1.HapifyVM({ timeout: 200 }).run('/* comment */ a();', {});
        code_1.fail('Should throw an error');
    }
    catch (e) {
        code_1.expect(e.name).to.equal('VmEvaluationError');
        code_1.expect(e.code).to.equal(6002);
        code_1.expect(e.message).to.equal('a is not defined');
        code_1.expect(e.details).to.be.a.string();
        code_1.expect(e.lineNumber).to.equal(1);
        code_1.expect(e.columnNumber).to.equal(15);
    }
}));
lab.test('evaluation error 2', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new index_1.HapifyVM({ timeout: 200 }).run('function() { return 3;', {});
        code_1.fail('Should throw an error');
    }
    catch (e) {
        code_1.expect(e.name).to.equal('VmEvaluationError');
        code_1.expect(e.code).to.equal(6002);
        code_1.expect(e.message).to.equal('Unexpected token (');
        code_1.expect(e.details).to.be.a.string();
        code_1.expect(e.lineNumber).to.be.a.number();
        code_1.expect(e.columnNumber).to.be.a.number();
    }
}));
//# sourceMappingURL=usage.js.map