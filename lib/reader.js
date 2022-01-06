import { isNewline } from "./grammer";

export function createStringReader(str) {
    let index = 0;
    let line = 1;
    let col = 1;

    const input = (new TextEncoder()).encode(str);

    function next() {
        let c = input[index++];
        if (isNewline(c)) {
            line++;
            col = 1;
        } else {
            col++;
        }
        return c;
    }

    function peek(offset = 0) {
        return input[index + offset];
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
