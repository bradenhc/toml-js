import * as types from "./types";

export function createParser(tokenizer, validator) {
    
    function parseKeyValuePair() {

    }

    function parse() {
        let toml = {};
        while(!tokenizer.eof()) {
            let tok = tokenizer.peek();
            if(tok.type == types.KEY) {
                const { key, value } = parseKeyValuePair();
                toml[key] = value;
            } else {
                tokenizer.panic("Failed to parse");
            }
        }
        return toml;
    }

    return { parse };
}
