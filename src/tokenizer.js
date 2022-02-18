// NOTE: alphabetical order
export const TokenNames = Object.freeze({
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
    SEPARATOR_LIST: 'separatorList',
})

export class TokenDefinition {
    constructor(name, pattern) {
        this.name = name;

        this._pattern = new RegExp(pattern);
    }

    match(input) {
        return input.match(this._pattern);
    }
}

export const DefaultTokenDefinitions = [
    new TokenDefinition(TokenNames.SEPARATOR_LIST, '^,'),
    new TokenDefinition(TokenNames.INSTRUCTION_END, '^;'),
    new TokenDefinition(TokenNames.PARATHESIS_OPEN, '^\\('),
    new TokenDefinition(TokenNames.PARATHESIS_CLOSE, '^\\)'),
    new TokenDefinition(TokenNames.BLOCK_OPEN, '^\\{'),
    new TokenDefinition(TokenNames.BLOCK_CLOSE, '^\\}'),
    new TokenDefinition(TokenNames.DATA_BOOLEAN, '^(true|false)'),
    /**
     * This is a simple regex, that matches either an integer of float. Multiple dots
     * aren't allowes and won't be matched.
     */
    new TokenDefinition(TokenNames.DATA_NUMBER, '^(\\d+)(\\.\\d+)?'),
    /**
     * Another regex exists which also allows for '\"' handling. However, most browsers
     * don't support this complex regex usage of new features.
     * Regex: ^(?<!\\)"((([^"])|(?<=\\)")+)(?<!\\)"
     */
    new TokenDefinition(TokenNames.DATA_STRING, '^"([^"])+"'),
    new TokenDefinition(TokenNames.DATA_REFERENCE, '^\\w+')
];

export class TokenMatch {
    constructor(name, value, position) {
        this.name = name;
        this.value = value;
        this.position = position;
    }
}

export default class Tokenizer {
    tokenize(input) {
        let tokens = [];
        let pos = 0;

        const consumeInput = (len) => {
            pos += len;
            const r = input.substring(0, len);
            input = input.slice(len);
            return r;
        };

        // match as lon as we have input
        while(input && input !== '') {
            // ignore all whitespaces/newline
            if(input.match(/^(\s|\n)/)) {
                consumeInput(1);
                continue;
            }

            // save the found token in higher context
            let foundToken = null;

            // check all token definitions in correct order
            for(const tokenDefinition of DefaultTokenDefinitions) {
                // check for match of token definition
                let m = tokenDefinition.match(input);
                // check if match success
                if(m) {
                    foundToken = new TokenMatch(
                        tokenDefinition.name,
                        m[0],
                        pos
                    );
                    consumeInput(m[0].length);
                    break;
                }
            }

            // nothing found, throw error
            if(!foundToken) {
                console.error(input);
                throw new Error('invalid input');
            }

            // store valid token
            tokens.push(foundToken);
        }

        return tokens;
    }
}