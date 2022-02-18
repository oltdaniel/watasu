import Tokenizer, * as WatasuTokenizer from "./tokenizer";
import Parser, * as WatasuParser from "./parser";
import Runner, * as WatasuRunner from "./runner";

/**
 * Expose all sub modules with a custom name.
 */
export {
    WatasuTokenizer,
    WatasuParser,
    WatasuRunner
};

export default class Watasu {
    constructor() {
        this.reset();
    }

    reset() {
        this.tokens = [];
        this.ast = null;

        this._tokenizer = new Tokenizer();
        this._parser = new Parser();
        this._runner = new Runner();
        this._program = null;
    }

    /**
     * Simply load a string program into the environment.
     * @param {string} program to tokenize and parse (aka. prepare for execution)
     */
    loadProgram(program) {
        this._program = program;
        this.tokenize();
        this.parse();
    }

    tokenize() {
        this.tokens = this._tokenizer.tokenize(this._program);
    }

    parse() {
        this.ast = this._parser.parse(this.tokens);
        this._runner.loadAst(this.ast);
    }

    step() {
        return this._runner.step();
    }

    registerCall(name, func) {
        return this._runner.registerCall(name, func);
    }

    deregisterCall(name) {
        return this._runner.deregisterCall(name);
    }
}