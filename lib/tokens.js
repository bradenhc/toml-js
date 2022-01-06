export const TokenTypes = {
    KEY: Symbol("key"),
    STRING: Symbol("string"),
    INTEGER: Symbol("integer"),
    FLOAT: Symbol("float"),
    BOOLEAN: Symbol("boolean"),
    PUNC: Symbol("punc")
};

function createToken(type, value, pos) {
    return { type, value, pos };
}

export const key = (val, pos) => createToken(TokenTypes.KEY, val, pos);
export const string = (val, pos) => createToken(TokenTypes.STRING, val, pos);
export const int = (val, pos) => createToken(TokenTypes.INTEGER, val, pos);
export const float = (val, pos) => createToken(TokenTypes.FLOAT, val, pos);
export const bool = (val, pos) => createToken(TokenTypes.BOOLEAN, val, pos);
export const punc = (val, pos) => createToken(TokenTypes.PUNC, val, pos);
