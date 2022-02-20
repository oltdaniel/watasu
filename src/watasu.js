import Tokenizer, * as WatasuTokenizer from './tokenizer';
import Parser, * as WatasuParser from './parser';
import Runner, * as WatasuRunner from './runner';

/**
 * Expose all sub modules with a custom name.
 */
export {
  WatasuTokenizer,
  WatasuParser,
  WatasuRunner,
};

/**
 * Combine a {@link Tokenizer}, {@link Parser} and {@link Runner} into a single
 * class with a simpler high-level interface.
 */
export default class Watasu {
  /**
   * Initialize a new Watasu instance.
   */
  constructor() {
    this.reset();
  }

  /**
   * Reset all known values within this Watasu instance.
   */
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

  /**
   * Tokenizer the loaded program with {@link Tokenizer.tokenize}.
   */
  tokenize() {
    this.tokens = this._tokenizer.tokenize(this._program);
  }

  /**
   * Parse the tokens with {@link Parser.parse} and load the generated AST into
   * the runner with {@link Runner.loadAst}.
   */
  parse() {
    this.ast = this._parser.parse(this.tokens);
    this._runner.loadAst(this.ast);
  }

  /**
   * Exetcute a single step with the runner via {@link Runner.step}.
   */
  step() {
    this._runner.step();
  }

  /**
   * Register a new function call with {@link Runner.registerCall}.
   * @param {string} name of that function call.
   * @param {void} func to store as a call for this name (no-aonymous function).
   */
  registerCall(name, func) {
    this._runner.registerCall(name, func);
  }

  /**
   * Deregisters a specific function call from the runner with
   * {@link Runner.deregisterCall}.
   * @param {string} name of function call to deregister.
   */
  deregisterCall(name) {
    this._runner.deregisterCall(name);
  }
}
