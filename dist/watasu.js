function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $01120a04dadc3b57$exports = {};

$parcel$defineInteropFlag($01120a04dadc3b57$exports);

$parcel$export($01120a04dadc3b57$exports, "TokenNames", function () { return $01120a04dadc3b57$export$6cb25827a0685cdc; });
$parcel$export($01120a04dadc3b57$exports, "TokenDefinition", function () { return $01120a04dadc3b57$export$122128d96a975594; });
$parcel$export($01120a04dadc3b57$exports, "DefaultTokenDefinitions", function () { return $01120a04dadc3b57$export$f99db0f1164ea5f1; });
$parcel$export($01120a04dadc3b57$exports, "TokenMatch", function () { return $01120a04dadc3b57$export$65f0d1768f22123; });
$parcel$export($01120a04dadc3b57$exports, "default", function () { return $01120a04dadc3b57$export$2e2bcd8739ae039; });
const $01120a04dadc3b57$export$6cb25827a0685cdc = Object.freeze({
    BLOCK_CLOSE: 'blockOpen',
    BLOCK_OPEN: 'blockOpen',
    DATA_BOOLEAN: 'dataBoolean',
    DATA_NAME: 'dataName',
    DATA_NUMBER: 'dataNumber',
    DATA_REFERENCE: 'dataReference',
    DATA_STRING: 'dataString',
    INSTRUCTION_END: 'instructionEnd',
    PARATHESIS_CLOSE: 'parathesisClose',
    PARATHESIS_OPEN: 'parathesisOpen',
    SEPARATOR_LIST: 'separatorList'
});
class $01120a04dadc3b57$export$122128d96a975594 {
    constructor(name, pattern){
        this.name = name;
        this._pattern = new RegExp(pattern);
    }
    match(input) {
        return input.match(this._pattern);
    }
}
const $01120a04dadc3b57$export$f99db0f1164ea5f1 = [
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.SEPARATOR_LIST, '^,'),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.INSTRUCTION_END, '^;'),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_OPEN, '^\\('),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_CLOSE, '^\\)'),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.BLOCK_OPEN, '^\\{'),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.BLOCK_CLOSE, '^\\}'),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_BOOLEAN, '^(true|false)'),
    /**
     * This is a simple regex, that matches either an integer of float. Multiple dots
     * aren't allowes and won't be matched.
     */ new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_NUMBER, '^(\\d+)(\\.\\d+)?'),
    /**
     * Another regex exists which also allows for '\"' handling. However, most browsers
     * don't support this complex regex usage of new features.
     * Regex: ^(?<!\\)"((([^"])|(?<=\\)")+)(?<!\\)"
     */ new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_STRING, '^"([^"])+"'),
    new $01120a04dadc3b57$export$122128d96a975594($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_REFERENCE, '^\\w+')
];
class $01120a04dadc3b57$export$65f0d1768f22123 {
    constructor(name, value, position){
        this.name = name;
        this.value = value;
        this.position = position;
    }
}
class $01120a04dadc3b57$export$2e2bcd8739ae039 {
    tokenize(input) {
        let tokens = [];
        let pos = 0;
        const consumeInput = (len)=>{
            pos += len;
            const r = input.substring(0, len);
            input = input.slice(len);
            return r;
        };
        // match as lon as we have input
        while(input && input !== ''){
            // ignore all whitespaces/newline
            if (input.match(/^(\s|\n)/)) {
                consumeInput(1);
                continue;
            }
            // save the found token in higher context
            let foundToken = null;
            // check all token definitions in correct order
            for (const tokenDefinition of $01120a04dadc3b57$export$f99db0f1164ea5f1){
                // check for match of token definition
                let m = tokenDefinition.match(input);
                // check if match success
                if (m) {
                    foundToken = new $01120a04dadc3b57$export$65f0d1768f22123(tokenDefinition.name, m[0], pos);
                    consumeInput(m[0].length);
                    break;
                }
            }
            // nothing found, throw error
            if (!foundToken) {
                console.error(input);
                throw new Error('invalid input');
            }
            // store valid token
            tokens.push(foundToken);
        }
        return tokens;
    }
}


var $dce4b4094d803b2e$exports = {};

$parcel$defineInteropFlag($dce4b4094d803b2e$exports);

$parcel$export($dce4b4094d803b2e$exports, "ASTNode", function () { return $dce4b4094d803b2e$export$ace047af85406962; });
$parcel$export($dce4b4094d803b2e$exports, "ASTNodeNames", function () { return $dce4b4094d803b2e$export$a0245889e666cf9e; });
$parcel$export($dce4b4094d803b2e$exports, "default", function () { return $dce4b4094d803b2e$export$2e2bcd8739ae039; });

class $dce4b4094d803b2e$export$ace047af85406962 {
    constructor(name, value, start, end){
        this.name = name;
        this.value = value;
        this.range = {
            start: start,
            end: end
        };
    }
}
const $dce4b4094d803b2e$export$a0245889e666cf9e = Object.freeze({
    DATA_BOOLEAN: 'dataBoolean',
    DATA_NUMBER: 'dataNumber',
    DATA_REFERENCE: 'dataReference',
    DATA_STRING: 'dataString',
    FUNCTION_BLOCK: 'functionBlock',
    FUNCTION_CALL: 'functionCall'
});
class $dce4b4094d803b2e$export$2e2bcd8739ae039 {
    constructor(){
        this.reset();
    }
    /**
     * Reset the parser informations.
     */ reset() {
        this._tokens = null;
        this._position = 0;
    }
    /**
     * Check the name of the next token.
     * @param {string} name that we want to compare to the next tokens name.
     * @returns whether that check succeeded.
     */ peekCheck(name) {
        if (this._position + 1 < this._tokens.length) return this._tokens[this._position + 1].name === name;
        return false;
    }
    /**
     * Increments the current position in the tokens list and reads the element. This
     * should be called after {@link this.peekCheck} to consume the peeked token.
     * @returns {TokenMatch} peeked token
     */ consumeToken() {
        this._position++;
        return this._tokens[this._position];
    }
    /**
     * This consumes the peeked token with {@link this.consumeToken} and throws an error
     * including the token information and position.
     * @param {string} expected message as error message
     */ throwTokenError(expected) {
        const errorToken = this.consumeToken();
        throw new Error(`expected ${expected} at position ${errorToken.position}. Got '${errorToken.value}'.`);
    }
    /**
     * Parse a given set of tokens into a valid ast.
     * @param {Array<TokenMatch>} tokens generated by the Tokenizer.
     * @returns {Array<ASTNode>} list of ast nodes in the root structure.
     */ parse(tokens) {
        this.reset();
        // we start with a null element, to always peek and then consume.
        this._tokens = [
            null
        ].concat(tokens);
        let nodes = [];
        while(this._position < this._tokens.length - 1)// check if this may be an function call
        if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_REFERENCE)) {
            const dataReference = this.consumeToken();
            // a function call equires open parathesis
            if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_OPEN)) {
                // ignore this token for the function call parsing
                this.consumeToken();
                // parse a full function call recursively
                const functionCall = this.parseFunctionCall(dataReference);
                nodes.push(functionCall);
                continue;
            } else this.throwTokenError('valid function call start');
        } else this.throwTokenError('function call');
        return nodes;
    }
    parseFunctionCall(dataReference) {
        const name = dataReference.value;
        let parameters = [];
        // shortcut if close the call directly
        if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_CLOSE)) {
            this.consumeToken();
            return new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.FUNCTION_CALL, {
                name: name,
                parameters: parameters
            });
        }
        let expectValue = true;
        let closeToken = null;
        while(this._position < this._tokens.length){
            if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_BOOLEAN) && expectValue) {
                const dataToken = this.consumeToken();
                const dataNode = new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.DATA_NUMBER, dataToken.value === 'true', dataToken.position, dataToken.position + dataToken.value.length);
                parameters.push(dataNode);
                expectValue = false;
                continue;
            } else if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_NUMBER) && expectValue) {
                const dataToken = this.consumeToken();
                const dataNode = new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.DATA_NUMBER, parseFloat(dataToken.value), dataToken.position, dataToken.position + dataToken.value.length);
                parameters.push(dataNode);
                expectValue = false;
                continue;
            } else if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_REFERENCE) && expectValue) {
                const dataToken = this.consumeToken();
                if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_OPEN)) {
                    this.consumeToken();
                    const functionCallNode = this.parseFunctionCall(dataToken);
                    parameters.push(functionCallNode);
                } else {
                    const dataNode = new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.DATA_REFERENCE, dataToken.value, dataToken.position, dataToken.position + dataToken.value.length);
                    parameters.push(dataNode);
                }
                expectValue = false;
                continue;
            } else if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_STRING) && expectValue) {
                const dataToken = this.consumeToken();
                const dataNode = new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.DATA_STRING, dataToken.value.slice(1, -1), dataToken.position, dataToken.position + dataToken.value.length);
                parameters.push(dataNode);
                expectValue = false;
                continue;
            } else if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.SEPARATOR_LIST) && !expectValue) {
                this.consumeToken();
                expectValue = true;
                continue;
            } else if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_CLOSE) && !expectValue) {
                closeToken = this.consumeToken();
                break;
            } else this.throwTokenError(expectValue ? 'function parameter' : 'function closing or list separator');
        }
        // check for function call end
        if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.INSTRUCTION_END)) {
            const endToken = this.consumeToken();
            return new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.FUNCTION_CALL, {
                name: name,
                parameters: parameters
            }, dataReference.position, endToken.position + 1);
        }
        // check function block token
        if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.BLOCK_OPEN)) {
            const openBlockToken = this.consumeToken();
            const block = this.parseFunctionBlock(openBlockToken);
            return new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.FUNCTION_CALL, {
                name: name,
                parameters: parameters,
                block: block
            }, dataReference.position, block.range.end);
        }
        return new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.FUNCTION_CALL, {
            name: name,
            parameters: parameters
        }, dataReference.position, closeToken.position + 1);
    }
    parseFunctionBlock(openBlock) {
        let nodes = [];
        while(this._position < this._tokens.length){
            if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.DATA_REFERENCE)) {
                const dataReference = this.consumeToken();
                // a function call equires open parathesis
                if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.PARATHESIS_OPEN)) {
                    // ignore this token for the function call parsing
                    this.consumeToken();
                    // parse a full function call recursively
                    const functionCall = this.parseFunctionCall(dataReference);
                    // push to block nodes
                    nodes.push(functionCall);
                    continue;
                } else this.throwTokenError('valid function call start');
            } else if (this.peekCheck($01120a04dadc3b57$export$6cb25827a0685cdc.BLOCK_CLOSE)) {
                const closeBlock = this.consumeToken();
                return new $dce4b4094d803b2e$export$ace047af85406962($dce4b4094d803b2e$export$a0245889e666cf9e.FUNCTION_BLOCK, nodes, openBlock.position, closeBlock.position + 1);
            } else this.throwTokenError('function block closing or function call');
        }
        throw new Error('No tokens left. Invalid function block.');
    }
}


var $8aab6329a967d8e2$exports = {};

$parcel$defineInteropFlag($8aab6329a967d8e2$exports);

$parcel$export($8aab6329a967d8e2$exports, "RunnerPosition", function () { return $8aab6329a967d8e2$export$e2351a601c09ef06; });
$parcel$export($8aab6329a967d8e2$exports, "default", function () { return $8aab6329a967d8e2$export$2e2bcd8739ae039; });

class $8aab6329a967d8e2$export$e2351a601c09ef06 {
    constructor(){
        this._path = [
            0
        ];
        this._returnStack = [
            ()=>{
                throw new Error('Too many returns!');
            }
        ];
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
class $8aab6329a967d8e2$export$2e2bcd8739ae039 {
    constructor(){
        this._calls = {
        };
        this.reset();
    }
    reset() {
        this._position = new $8aab6329a967d8e2$export$e2351a601c09ef06();
        this._ast = null;
        this._context = {
        };
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
        for (const positionStep of this._position._path){
            // check if we have an function block on our hands
            if (current.value && current.value.block) {
                // check if this step exists
                if (current.value.block.value[positionStep]) {
                    current = current.value.block.value[positionStep];
                    continue;
                } else {
                    // end of execution block, pop return call
                    let callback = this._position.popReturn();
                    // if callback didn't succeed, restart block and append the callback again
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
            } else if (current[positionStep]) // select a given step
            current = current[positionStep];
            else // maybe we've stepped to the end or the path is invalid
            return undefined;
        }
        // return the path end
        return current;
    }
    step() {
        const node = this.currentNode();
        if (!node) {
            this.isDone = true;
            return;
        }
        this._lastNode = node;
        if (node.name === $dce4b4094d803b2e$export$a0245889e666cf9e.FUNCTION_CALL) this.resolveFunctionCall(node);
        else throw new Error('no function call given for next step');
        this._position.inc();
    }
    resolveFunctionCall(node) {
        if (this._calls[node.value.name]) return this._calls[node.value.name](...node.value.parameters);
        else throw new Error(`unknown function call to '${node.value.name}'`);
    }
    resolveParameterValue(parameter) {
        if (parameter.name === $dce4b4094d803b2e$export$a0245889e666cf9e.DATA_BOOLEAN) return parameter.value;
        else if (parameter.name === $dce4b4094d803b2e$export$a0245889e666cf9e.DATA_NUMBER) return parameter.value;
        else if (parameter.name === $dce4b4094d803b2e$export$a0245889e666cf9e.DATA_REFERENCE) return this._context[parameter.value];
        else if (parameter.name === $dce4b4094d803b2e$export$a0245889e666cf9e.DATA_STRING) return parameter.value;
        else if (parameter.name === 'functionCall') return this.resolveFunctionCall(parameter);
        else throw new Error(`unknown parameter ASTNode name '${parameter.name}'`);
    }
    resolveParametersValues(parameters) {
        let result = [];
        for (const parameter of parameters)result.push(this.resolveParameterValue(parameter));
        return result;
    }
}


class $6e4e62d6fb7b62ed$export$2e2bcd8739ae039 {
    constructor(){
        this.reset();
    }
    reset() {
        this.tokens = [];
        this.ast = null;
        this._tokenizer = new $01120a04dadc3b57$export$2e2bcd8739ae039();
        this._parser = new $dce4b4094d803b2e$export$2e2bcd8739ae039();
        this._runner = new $8aab6329a967d8e2$export$2e2bcd8739ae039();
        this._program = null;
    }
    /**
     * Simply load a string program into the environment.
     * @param {string} program to tokenize and parse (aka. prepare for execution)
     */ loadProgram(program) {
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


export {$6e4e62d6fb7b62ed$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=watasu.js.map
