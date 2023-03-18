import { isNewline, isCarriageReturn } from "./grammer";

export const EOL = Symbol("eol");

export function createStringReader(str) {
    let index = 0;
    let line = 1;
    let col = 1;

    const input = new TextEncoder().encode(str);

    function updatePosToNextLine() {
        line++;
        col = 1;
    }

    function next() {
        const c = input[index++];
        if (isNewline(c)) {
            updatePosToNextLine();
            return EOL;
        } else if (isCarriageReturn(c)) {
            if (isNewline(input[index++])) {
                updatePosToNextLine();
                return EOL;
            } else {
                panic("Invalid carriage-return");
            }
        } else {
            col++;
            return c;
        }
    }

    function peek(offset = 0) {
        const c = input[index + offset];
        if (isNewline(c) || (isCarriageReturn(c) && isNewline(input[index + offset + 1]))) {
            return EOL;
        } else {
            return c;
        }
    }

    function eof() {
        return peek() === undefined;
    }

    function pos() {
        return { line, col };
    }

    function panic(message) {
        throw new Error("FAIL(" + line + ":" + col + ") " + message);
    }

    return { next, peek, eof, pos, panic };
}
