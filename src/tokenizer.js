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
});

/**
 * Describe a specific token with an unique name and regex for matching.
 */
export class TokenDefinition {
  /**
   * Construct a new token definition.
   * @param {string} name of this token definition.
   * @param {string} pattern to describe this token definition.
   */
  constructor(name, pattern) {
    this.name = name;

    this._pattern = new RegExp(pattern);
  }

  /**
   * Checks if an input is valid for this specific token definition.
   * @param {string} input to match with the given definition regex.
   * @return {RegExpMatchArray} matched regex result.
   */
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
     * This is a simple regex, that matches either an integer of float.
     * Multiple dots aren't allowes and won't be matched.
     */
  new TokenDefinition(TokenNames.DATA_NUMBER, '^(\\d+)(\\.\\d+)?'),
  /**
     * Another regex exists which also allows for '\"' handling.
     * However, most browsers don't support this complex regex
     * usage of new features.
     * Regex: ^(?<!\\)"((([^"])|(?<=\\)")+)(?<!\\)"
     */
  new TokenDefinition(TokenNames.DATA_STRING, '^"([^"])+"'),
  new TokenDefinition(TokenNames.DATA_REFERENCE, '^\\w+'),
];

/**
 * Describe the details of a specific found token.
 */
export class TokenMatch {
  /**
   * Construct a new match.
   * @param {string} name of that token type.
   * @param {string|number} value of that token.
   * @param {number} position of the start of the token
   */
  constructor(name, value, position) {
    this.name = name;
    this.value = value;
    this.position = position;
  }
}

/**
 * Tokenizer class
 */
export default class Tokenizer {
  /**
   * Tokenize a given program in form of a string.
   * @param {string} input
   * @return {Array<TokenMatch>} all found tokens
   */
  tokenize(input) {
    const tokens = [];
    let pos = 0;

    const consumeInput = (len) => {
      pos += len;
      const r = input.substring(0, len);
      input = input.slice(len);
      return r;
    };

    // match as lon as we have input
    while (input && input !== '') {
      // ignore all whitespaces/newline
      if (input.match(/^(\s|\n)/)) {
        consumeInput(1);
        continue;
      }

      // save the found token in higher context
      let foundToken = null;

      // check all token definitions in correct order
      for (const tokenDefinition of DefaultTokenDefinitions) {
        // check for match of token definition
        const m = tokenDefinition.match(input);
        // check if match success
        if (m) {
          foundToken = new TokenMatch(
              tokenDefinition.name,
              m[0],
              pos,
          );
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
