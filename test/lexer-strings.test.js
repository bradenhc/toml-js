import { createLexer } from "../lib/lexer";
import { createStringReader } from "../lib/reader";

import { key, punc, string } from "../lib/tokens";

test("should lex key/value pair for basic string value", () => {
    const toml = `key = "value"`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(string("value", { line: 1, col: 8 }));
    expect(l.next()).toBeNull();
});
