import { TokenNames } from "./tokenizer";

export class ASTNode {
    constructor(name, value, start, end) {
        this.name = name;
        this.value = value;
        this.range = {start, end};
    }
}

export const ASTNodeNames = Object.freeze({
    DATA_BOOLEAN: 'dataBoolean',
    DATA_NUMBER: 'dataNumber',
    DATA_REFERENCE: 'dataReference',
    DATA_STRING: 'dataString',
    FUNCTION_BLOCK: 'functionBlock',
    FUNCTION_CALL: 'functionCall',
});

export default class Parser {
    constructor() {
        this.reset();
    }

    /**
     * Reset the parser informations.
     */
    reset() {
        this._tokens = null;
        this._position = 0;
    }

    /**
     * Check the name of the next token.
     * @param {string} name that we want to compare to the next tokens name.
     * @returns whether that check succeeded.
     */
    peekCheck(name) {
        if(this._position + 1 < this._tokens.length) {
            return this._tokens[this._position + 1].name === name;
        }
        return false;
    }

    /**
     * Increments the current position in the tokens list and reads the element. This
     * should be called after {@link this.peekCheck} to consume the peeked token.
     * @returns {TokenMatch} peeked token
     */
    consumeToken() {
        this._position++;
        return this._tokens[this._position];
    }

    /**
     * This consumes the peeked token with {@link this.consumeToken} and throws an error
     * including the token information and position.
     * @param {string} expected message as error message
     */
    throwTokenError(expected) {
        const errorToken = this.consumeToken();
        throw new Error(`expected ${expected} at position ${errorToken.position}. Got '${errorToken.value}'.`);
    }

    /**
     * Parse a given set of tokens into a valid ast.
     * @param {Array<TokenMatch>} tokens generated by the Tokenizer.
     * @returns {Array<ASTNode>} list of ast nodes in the root structure.
     */
    parse(tokens) {
        this.reset();

        // we start with a null element, to always peek and then consume.
        this._tokens = [null].concat(tokens);

        let nodes = [];

        while(this._position < this._tokens.length - 1) {
            // check if this may be an function call
            if(this.peekCheck(TokenNames.DATA_REFERENCE)) {
                const dataReference = this.consumeToken();
                // a function call equires open parathesis
                if(this.peekCheck(TokenNames.PARATHESIS_OPEN)) {
                    // ignore this token for the function call parsing
                    this.consumeToken();
                    // parse a full function call recursively
                    const functionCall = this.parseFunctionCall(dataReference);
                    nodes.push(functionCall);
                    continue;
                } else {
                    this.throwTokenError('valid function call start');
                }
            } else {
                this.throwTokenError('function call');
            }
        }

        return nodes;
    }

    parseFunctionCall(dataReference) {
        const name = dataReference.value;
        let parameters = [];

        // shortcut if close the call directly
        if(this.peekCheck(TokenNames.PARATHESIS_CLOSE)) {
            this.consumeToken();
            return new ASTNode(ASTNodeNames.FUNCTION_CALL, {name, parameters});
        }

        let expectValue = true;
        let closeToken = null;

        while (this._position < this._tokens.length) {
            if(this.peekCheck(TokenNames.DATA_BOOLEAN) && expectValue) {
                const dataToken = this.consumeToken();
                const dataNode = new ASTNode(
                    ASTNodeNames.DATA_NUMBER,
                    dataToken.value === 'true',
                    dataToken.position,
                    dataToken.position + dataToken.value.length
                );
                parameters.push(dataNode);
                expectValue = false;
                continue;
            } else if(this.peekCheck(TokenNames.DATA_NUMBER) && expectValue) {
                const dataToken = this.consumeToken();
                const dataNode = new ASTNode(
                    ASTNodeNames.DATA_NUMBER,
                    parseFloat(dataToken.value),
                    dataToken.position,
                    dataToken.position + dataToken.value.length
                );
                parameters.push(dataNode);
                expectValue = false;
                continue;
            } else if(this.peekCheck(TokenNames.DATA_REFERENCE) && expectValue) {
                const dataToken = this.consumeToken();
                if(this.peekCheck(TokenNames.PARATHESIS_OPEN)) {
                    this.consumeToken();
                    const functionCallNode = this.parseFunctionCall(dataToken);
                    parameters.push(functionCallNode);
                } else {
                    const dataNode = new ASTNode(
                        ASTNodeNames.DATA_REFERENCE,
                        dataToken.value,
                        dataToken.position,
                        dataToken.position + dataToken.value.length
                    );
                    parameters.push(dataNode);
                }
                expectValue = false;
                continue;
            } else if(this.peekCheck(TokenNames.DATA_STRING) && expectValue) {
                const dataToken = this.consumeToken();
                const dataNode = new ASTNode(
                    ASTNodeNames.DATA_STRING,
                    dataToken.value.slice(1, -1),
                    dataToken.position,
                    dataToken.position + dataToken.value.length
                );
                parameters.push(dataNode);
                expectValue = false;
                continue;
            } else if(this.peekCheck(TokenNames.SEPARATOR_LIST) && !expectValue) {
                this.consumeToken();
                expectValue = true;
                continue;
            } else if(this.peekCheck(TokenNames.PARATHESIS_CLOSE) && !expectValue) {
                closeToken = this.consumeToken();
                break;
            } else {
                this.throwTokenError(expectValue ? 'function parameter' : 'function closing or list separator');
            }
        }

        // check for function call end
        if(this.peekCheck(TokenNames.INSTRUCTION_END)) {
            const endToken = this.consumeToken();
            return new ASTNode(
                ASTNodeNames.FUNCTION_CALL,
                { name, parameters },
                dataReference.position,
                endToken.position + 1
            );
        }
        
        // check function block token
        if(this.peekCheck(TokenNames.BLOCK_OPEN)) {
            const openBlockToken = this.consumeToken();
            const block = this.parseFunctionBlock(openBlockToken);
            return new ASTNode(
                ASTNodeNames.FUNCTION_CALL,
                { name, parameters, block },
                dataReference.position,
                block.range.end
            )
        }

        return new ASTNode(
            ASTNodeNames.FUNCTION_CALL,
            { name, parameters },
            dataReference.position,
            closeToken.position + 1
        );
    }

    parseFunctionBlock(openBlock) {
        let nodes = [];

        while (this._position < this._tokens.length) {
            if(this.peekCheck(TokenNames.DATA_REFERENCE)) {
                const dataReference = this.consumeToken();
                // a function call equires open parathesis
                if(this.peekCheck(TokenNames.PARATHESIS_OPEN)) {
                    // ignore this token for the function call parsing
                    this.consumeToken();
                    // parse a full function call recursively
                    const functionCall = this.parseFunctionCall(dataReference);
                    // push to block nodes
                    nodes.push(functionCall);
                    continue;
                } else {
                    this.throwTokenError('valid function call start');
                }
            } else if(this.peekCheck(TokenNames.BLOCK_CLOSE)) {
                const closeBlock = this.consumeToken();
                return new ASTNode(
                    ASTNodeNames.FUNCTION_BLOCK,
                    nodes,
                    openBlock.position,
                    closeBlock.position + 1
                );
            } else {
                this.throwTokenError('function block closing or function call');
            }
        }

        throw new Error('No tokens left. Invalid function block.');
    }
}