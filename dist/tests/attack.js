"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("@hapi/code");
const Lab = __importStar(require("@hapi/lab"));
const lab = (exports.lab = Lab.script());
const index_1 = require("../index");
lab.test('process accesses', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'process.exit();';
    code_1.expect(() => new index_1.HapifyVM().run(script, {})).to.throw('process is not defined');
}));
lab.test('require accesses 1', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'require("http");';
    code_1.expect(() => new index_1.HapifyVM().run(script, {})).to.throw('require is not defined');
}));
lab.test('require accesses 2', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'models.constructor.constructor("return process.mainModule.require")()("http")';
    code_1.expect(() => new index_1.HapifyVM().run(script, { models: {} })).to.throw('Code generation from strings disallowed for this context');
}));
lab.test('global values', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'return JSON.stringify(Object.keys(global));';
    const result = JSON.parse(new index_1.HapifyVM().run(script, {}));
    code_1.expect(result).to.equal(['VMError', 'Proxy', 'Buffer']);
}));
lab.test('process deep accesses', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'models.constructor.constructor("return { process }")().exit()';
    code_1.expect(() => new index_1.HapifyVM().run(script, { models: {} })).to.throw('Code generation from strings disallowed for this context');
}));
lab.test('process deep accesses with this', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'this.constructor.constructor("return { process }")().exit()';
    code_1.expect(() => new index_1.HapifyVM().run(script, {})).to.throw('Code generation from strings disallowed for this context');
}));
lab.test('alter console 1', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'console = undefined; return "";';
    new index_1.HapifyVM().run(script, {});
    code_1.expect(console).to.not.be.undefined();
}));
lab.test('alter console 2', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'console.log = function() { return "trojan" }; return "";';
    new index_1.HapifyVM().run(script, {});
    code_1.expect(console.log()).to.not.be.a.string();
}));
lab.test('return fake string', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'return { toString: function() { /* Bad function */ } };';
    code_1.expect(() => new index_1.HapifyVM().run(script, {})).to.throw('Must return a string');
}));
lab.test('throw evil error 1', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'throw { message: { toString: function() { /* Bad function */ } } };';
    code_1.expect(() => new index_1.HapifyVM().run(script, {})).to.throw('Invalid error');
}));
lab.test('throw evil error 2', () => __awaiter(void 0, void 0, void 0, function* () {
    const script = 'throw { stack: { toString: function() { /* Bad function */ } } };';
    try {
        new index_1.HapifyVM().run(script, {});
        code_1.fail('Should throw an error');
    }
    catch (e) {
        code_1.expect(e.name).to.equal('VmIntegrityError');
        code_1.expect(e.code).to.equal(6004);
        code_1.expect(e.message).to.equal('Invalid error');
    }
}));
//# sourceMappingURL=attack.js.map