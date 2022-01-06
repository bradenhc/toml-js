import { createLexer } from "../lib/lexer";
import { createStringReader } from "../lib/reader";

import { key, punc, int } from "../lib/tokens";

test("should lex key/value pair for integer value", () => {
    const toml = `key = 24`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(int(24, { line: 1, col: 7 }));
    expect(l.next()).toBeNull();
});

test("should lex key/value pair for integer value with underscores", () => {
    const toml = `key = 240_000`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(int(240000, { line: 1, col: 7 }));
    expect(l.next()).toBeNull();
});

test("should lex key/value pair for integer value as hex", () => {
    const toml = `key = 0xABC`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(int(2748, { line: 1, col: 7 }));
    expect(l.next()).toBeNull();
});

test("should lex key/value pair for integer value as hex with underscores", () => {
    const toml = `key = 0xDEAD_BEEF`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(int(3735928559, { line: 1, col: 7 }));
    expect(l.next()).toBeNull();
});

test("should lex key/value pair for integer value as oct", () => {
    const toml = `key = 0o465`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(int(309, { line: 1, col: 7 }));
    expect(l.next()).toBeNull();
});

test("should lex key/value pair for integer value as oct with underscores", () => {
    const toml = `key = 0o12_34_56`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toEqual(key("key", { line: 1, col: 1 }));
    expect(l.next()).toEqual(punc("=", { line: 1, col: 5 }));
    expect(l.next()).toEqual(int(42798, { line: 1, col: 7 }));
    expect(l.next()).toBeNull();
});