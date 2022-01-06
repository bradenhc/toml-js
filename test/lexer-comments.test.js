import { createLexer } from "../lib/lexer";
import { createStringReader } from "../lib/reader";

test("should ignore comment", () => {
    const toml = `# This is a comment that should be ignored`;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toBeNull();
});

test("should ignore multiple comments", () => {
    const toml = `
        # Ignore
        # Ignore
        # Ignore
    `;
    const r = createStringReader(toml);
    const l = createLexer(r);
    expect(l.next()).toBeNull();
});
