import {ASTNodeNames} from './parser';

/**
 * Store information about the runners position and keep track of the
 * return stack and some helper functions for the position.
 */
export class RunnerPosition {
  /**
   * Initialize a new position element.
   */
  constructor() {
    this._path = [0];
    this._returnStack = [
      () => {
        throw new Error('Too many returns!');
      },
    ];
  }

  /**
   * Increment the current position.
   */
  inc() {
    this._path[this._path.length - 1]++;
  }

  /**
   * Reset the current path element to 0.
   */
  restart() {
    this._path[this._path.length - 1] = 0;
  }

  /**
   * Go deeper into the AST by pushing a -1 to the position path.
   */
  deeper() {
    this._path.push(-1);
  }

  /**
   * Remove a path element.
   */
  higher() {
    this._path.pop();
  }

  /**
   * Store a new return function for this block.
   * @param {void} func to call if the return is popped.
   */
  pushReturn(func) {
    this._returnStack.push(func);
  }

  /**
   * Pops the last return call.
   * @return {void} return call.
   */
  popReturn() {
    return this._returnStack.pop();
  }
}

/**
 * Execute a given AST from the parser.
 */
export default class Runner {
  /**
   * Initialize a new runner instance.
   */
  constructor() {
    this._calls = {};

    this.reset();
  }

  /**
   * Reset all runner values, except for the registered calls.
   */
  reset() {
    this._position = new RunnerPosition();
    this._ast = null;
    this._context = {};
    this._lastNode = null;

    this.isDone = false;
  }

  /**
   * Calls {@link Runner.reset} and loads the given AST.
   * @param {Array<ASTNode>} ast to store.
   */
  loadAst(ast) {
    this.reset();
    this._ast = ast;
  }

  /**
   * Register a new call for the runner.
   * @param {string} name for that function call.
   * @param {void} func to store as call for this name.
   */
  registerCall(name, func) {
    this._calls[name] = func.bind(this);
  }

  /**
   * Deregister a call from the runner.
   * @param {string} name of the call to deregister.
   */
  deregisterCall(name) {
    delete this._calls[name];
  }

  /**
   * Determine the current node from the position.
   * @return {ASTNode|undefined} the current node.
   */
  currentNode() {
    // keep track of the current element of the latest position step
    let current = this._ast;
    // step for each path element
    for (const positionStep of this._position._path) {
      // check if we have an function block on our hands
      if (current.value && current.value.block) {
        // check if this step exists
        if (current.value.block.value[positionStep]) {
          current = current.value.block.value[positionStep];
          continue;
        } else {
          // end of execution block, pop return call
          const callback = this._position.popReturn();
          // if callback didn't succeed, restart block
          // and append the callback again
          if (!callback()) {
            this._position.restart();
            this._position.pushReturn(callback);
          } else {
            this._position.higher();
            this._position.inc();
          }
          // callback may have changed position, try again
          return this.currentNode();
        }
      } else if (current[positionStep]) {
        // select a given step
        current = current[positionStep];
      } else {
        // maybe we've stepped to the end or the path is invalid
        return undefined;
      }
    }
    // return the path end
    return current;
  }

  /**
   * Execute a single step, increment the position of possible check if the
   * runner is done executing.
   * @throws {Error} if the ast is invalid in the current position.
   * @return {boolean} if the runner is done or not.
   */
  step() {
    const node = this.currentNode();

    if (!node) {
      this.isDone = true;
      return this.isDone;
    }

    this._lastNode = node;

    if (node.name === ASTNodeNames.FUNCTION_CALL) {
      this.resolveFunctionCall(node);
    } else {
      throw new Error('no function call given for next step');
    }

    this._position.inc();

    return this.isDone;
  }

  /**
   * Execute a given function call with the given parameters.
   * @throws {Error} if the function call does not exist.
   * @param {ASTNode} node which cointains the function call content.
   * @return {*} return of the function call.
   */
  resolveFunctionCall(node) {
    if (this._calls[node.value.name]) {
      return this._calls[node.value.name](...node.value.parameters);
    } else {
      throw new Error(`unknown function call to '${node.value.name}'`);
    }
  }

  /**
   * Determines the value of a specific node if possible.
   * @throws {Error} if the node is not a valid parameter.
   * @param {ASTNode} parameter to resolve.
   * @return {*} actual value behind a given ASTNode.
   */
  resolveParameterValue(parameter) {
    if (parameter.name === ASTNodeNames.DATA_BOOLEAN) {
      return parameter.value;
    } else if (parameter.name === ASTNodeNames.DATA_NUMBER) {
      return parameter.value;
    } else if (parameter.name === ASTNodeNames.DATA_REFERENCE) {
      return this._context[parameter.value];
    } else if (parameter.name === ASTNodeNames.DATA_STRING) {
      return parameter.value;
    } else if (parameter.name === ASTNodeNames.FUNCTION_CALL) {
      return this.resolveFunctionCall(parameter);
    } else {
      throw new Error(`unknown parameter ASTNode name '${parameter.name}'`);
    }
  }

  /**
   *
   * @param {Array<ASTNode>} parameters to resolve.
   * @return {Array<*>} actual values behind given {@link ASTNode}.
   */
  resolveParametersValues(parameters) {
    const result = [];
    for (const parameter of parameters) {
      result.push(this.resolveParameterValue(parameter));
    }
    return result;
  }
}
