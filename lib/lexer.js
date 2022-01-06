import { int, key, punc, string } from "./tokens";
import * as g from "./grammer";

export function createLexer(reader) {
    let current = null;

    const decoder = new TextDecoder();

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
        readWhile(g.isNonEol);
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
                    reader.panic("Invalid escape character: \\" + String.fromCodePoint(c));
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
                reader.panic("Invalid character in string: " + String.fromCodePoint(c) + " (" + c + ")");
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
        if (g.isLeadingZero(c)) {
            reader.next();
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
            reader.panic(`Invalid integer prefix 0${c1}`);
        }
        return int(readDecimalInteger(), pos);
    }

    function readNext() {
        readWhile((c) => g.isCarriageReturn(c) || g.isNewline(c) || g.isWhitespace(c));
        if (reader.eof()) {
            return null;
        }
        let c = reader.peek();
        if (g.isCommentStart(c)) {
            readComment();
            return null;
        }
        if (g.isDigit(c)) {
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
        reader.panic("Unable to read next token: not supported");
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

    return { peek, next, eof, panic: reader.panic };
}
