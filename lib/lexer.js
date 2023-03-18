import { int, key, punc, string } from "./tokens";
import * as g from "./grammer";
import { EOL } from "./reader";

export function createLexer(reader) {
    let current = null;

    const decoder = new TextDecoder();

    function isEol(c) {
        return c === EOL;
    }

    function isEolNext(offset = 0) {
        return reader.peek(offset) === EOL;
    }

    function readWhile(pred, ignorePred) {
        let a = [];
        while (!reader.eof() && pred(reader.peek())) {
            const c = reader.next();
            if (ignorePred === undefined || !ignorePred(c)) {
                a.push(c);
            }
        }
        return decoder.decode(new Uint8Array(a));
    }

    function readComment() {
        reader.next();
        readWhile((c) => !isEol(c));
    }

    function readBasicString() {
        const pos = reader.pos();
        let escaped = false;
        let uCount = 0;
        const val = readWhile((c) => {
            if (g.isQuotationMark(c) && !escaped) {
                return false;
            }
            if (g.isEscape(c)) {
                escaped = true;
            } else if (escaped) {
                if (!g.isEscapeChar(c)) {
                    panic("Invalid escape character: \\" + String.fromCodePoint(c));
                }
                if (g.isLittleU(c)) {
                    uCount = 4;
                } else if (g.isBigU(c)) {
                    uCount = 8;
                }
                escaped = false;
            } else if (uCount > 0) {
                uCount--;
            } else if (!g.isBasicUnescaped(c)) {
                panic("Invalid character in string: " + String.fromCodePoint(c) + " (" + c + ")");
            }
            return true;
        });
        return string(val, pos);
    }

    function readString() {
        // TODO: Support other string types
        reader.next(); // "
        const str = readBasicString();
        reader.next(); // "
        return str;
    }

    function readKey() {
        const pos = reader.pos();
        const val = readWhile(g.isUnquotedKey);
        return key(val, pos);
    }

    function readPunc() {
        const pos = reader.pos();
        const val = String.fromCodePoint(reader.next());
        return punc(val, pos);
    }

    function readDecimalInteger() {
        const val = readWhile((c) => g.isDigit(c) || g.isUnderscore(c), g.isUnderscore);
        return parseInt(val, 10);
    }

    function readHexInteger() {
        const val = readWhile((c) => g.isHexDigit(c) || g.isUnderscore(c), g.isUnderscore);
        return parseInt(val, 16);
    }

    function readOctInteger() {
        const val = readWhile((c) => g.isDigit0to7(c) || g.isUnderscore(c), g.isUnderscore);
        return parseInt(val, 8);
    }

    function readBinInteger() {
        const val = readWhile((c) => g.isDigit0to1(c) || g.isUnderscore(c), g.isUnderscore);
        return parseInt(val, 2);
    }

    function readNumber() {
        const pos = reader.pos();
        const c = reader.peek();
        if (g.isZero(c)) {
            reader.next();
            if (g.isWhitespace(reader.peek()) || isEolNext()) {
                return int(0, pos);
            }
            const c1 = reader.next();
            if (g.isHexPrefix(c1)) {
                return int(readHexInteger(), pos);
            }
            if (g.isOctPrefix(c1)) {
                return int(readOctInteger(), pos);
            }
            if (g.isBinPrefix(c1)) {
                return int(readBinInteger(), pos);
            }
            panic(`Invalid integer prefix 0${c1}`);
        }
        if (g.isPlus(c)) {
            if (g.isZero(reader.peek(1))) {
                if (g.isWhitespace(reader.peek(2)) || isEolNext(2)) {
                    // +0
                    return int(0, pos);
                } else {
                    // In an error state. Figure out what situation we are in to print out a more helpful error message
                    reader.next();
                    const c1 = reader.next();
                    if (g.isHexPrefix(c1) || g.isOctPrefix(c1) || g.isBinPrefix(c1)) {
                        panic("Prefixed integers cannot be signed");
                    } else {
                        panic("Leading zeros are not allowed in signed integers");
                    }
                }
            } else {
                // Potentially valid '+' prefix on integer. Read the rest.
                reader.next();
                return int(readDecimalInteger(), pos);
            }
        } else if (g.isMinus(c)) {
            // Negative integer
            reader.next();
            return int(-1 * readDecimalInteger(), pos);
        } else {
            // Normal integer
            return int(readDecimalInteger(), pos);
        }
    }

    function readNext() {
        readWhile((c) => g.isWhitespace(c) || isEol(c));
        if (reader.eof()) {
            return null;
        }
        let c = reader.peek();
        if (g.isCommentStart(c)) {
            readComment();
            return null;
        }
        if (g.isDigit(c) || g.isPlus(c) || g.isMinus(c)) {
            return readNumber();
        }
        if (g.isUnquotedKey(c)) {
            return readKey();
        }
        if (g.isKeyValSep(c)) {
            return readPunc();
        }
        if (g.isQuotationMark(c)) {
            return readString();
        }
        panic("Unable to read next token: not supported");
    }

    function peek() {
        return current || (current = readNext());
    }

    function next() {
        let token = current;
        current = null;
        return token || readNext();
    }

    function eof() {
        return peek() === null;
    }

    function panic(message) {
        reader.panic(message);
    }

    return { peek, next, eof, panic };
}
