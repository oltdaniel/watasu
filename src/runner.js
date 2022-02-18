import { ASTNodeNames } from "./parser";

export class RunnerPosition {
    constructor() {
        this._path = [0];
        this._returnStack = [
            () => {
                throw new Error('Too many returns!');
            }
        ]
    }

    inc() {
        this._path[this._path.length - 1]++;
    }

    restart() {
        this._path[this._path.length - 1] = 0;
    }

    deeper() {
        this._path.push(-1);
    }

    higher() {
        this._path.pop();
    }

    pushReturn(func) {
        this._returnStack.push(func);
    }

    popReturn() {
        return this._returnStack.pop();
    }
}

export default class Runner {
    constructor() {
        this._calls = {};

        this.reset();
    }

    reset() {
        this._position = new RunnerPosition();
        this._ast = null;
        this._context = {};
        this._lastNode = null;

        this.isDone = false;
    }

    loadAst(ast) {
        this.reset();
        this._ast = ast;
    }

    registerCall(name, func) {
        this._calls[name] = func.bind(this);
    }

    deregisterCall(name) {
        delete this._calls[name];
    }

    currentNode() {
        // keep track of the current element of the latest position step
        let current = this._ast;
        // step for each path element
        for(const positionStep of this._position._path) {
            // check if we have an function block on our hands
            if(current.value && current.value.block) {
                // check if this step exists
                if(current.value.block.value[positionStep]) {
                    current = current.value.block.value[positionStep];
                    continue;
                } else {
                    // end of execution block, pop return call
                    let callback = this._position.popReturn();
                    // if callback didn't succeed, restart block and append the callback again
                    if(!callback()) {
                        this._position.restart();
                        this._position.pushReturn(callback);
                    } else {
                        this._position.higher();
                        this._position.inc();
                    }
                    // callback may have changed position, try again
                    return this.currentNode();
                }
            } else if(current[positionStep]) {
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

    step() {
        const node = this.currentNode();

        if(!node) {
            this.isDone = true;
            return;
        }

        this._lastNode = node;

        if(node.name === ASTNodeNames.FUNCTION_CALL) {
            this.resolveFunctionCall(node);
        } else {
            throw new Error('no function call given for next step');
        }

        this._position.inc();
    }

    resolveFunctionCall(node) {
        if(this._calls[node.value.name]) {
            return this._calls[node.value.name](...node.value.parameters);
        } else {
            throw new Error(`unknown function call to '${node.value.name}'`);
        }
    }

    resolveParameterValue(parameter) {
        if(parameter.name === ASTNodeNames.DATA_BOOLEAN) {
            return parameter.value;
        } else if(parameter.name === ASTNodeNames.DATA_NUMBER) {
            return parameter.value;
        } else if(parameter.name === ASTNodeNames.DATA_REFERENCE) {
            return this._context[parameter.value];
        } else if(parameter.name === ASTNodeNames.DATA_STRING) {
            return parameter.value;
        } else if(parameter.name === 'functionCall') {
            return this.resolveFunctionCall(parameter);
        } else {
            throw new Error(`unknown parameter ASTNode name '${parameter.name}'`);
        }
    }

    resolveParametersValues(parameters) {
        let result = [];
        for(const parameter of parameters) {
            result.push(this.resolveParameterValue(parameter));
        }
        return result;
    }
}