// Define some basic starting points
export const isAlpha = (c) => (c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a); // A-Z / a-z
export const isDigit = (c) => c >= 0x30 && c <= 0x39; // 0-9
export const isHexDigit = (c) => isDigit(c) || [0x41, 0x42, 0x43, 0x44, 0x45, 0x46].indexOf(c) >= 0;

// Whitespace
export const isWhitespace = (c) => c === 0x20 || c === 0x09; // space / tab

// Newline
export const isNewline = (c) => c === 0x0a; // \n
export const isCarriageReturn = (c) => c === 0x0d; // \r

// Comments
export const isCommentStart = (c) => c === 0x23; // #
export const isNonAscii = (c) => (c >= 0x80 && c <= 0xd7ff) || (c >= 0xe000 && c <= 0x10ffff);
export const isNonEol = (c) => c === 0x09 || (c >= 0x20 && c <= 0x7f) || isNonAscii(c);

// Key-Value pairs
export const isUnquotedKey = (c) => isAlpha(c) || isDigit(c) || [0x2d, 0x5f].indexOf(c) >= 0; // A-Z / a-z / 0-9 / - / _
export const isDotSep = (c) => c === 0x2e; // .
export const isKeyValSep = (c) => c === 0x3d; // =

// Basic String
export const isQuotationMark = (c) => c === 0x22; // "
export const isBasicUnescaped = (c) =>
    isWhitespace(c) || c === 0x21 || (c >= 0x23 && c <= 0x5b) || (c >= 0x5d && c <= 0x7e) || isNonAscii(c);
export const isEscape = (c) => c === 0x5c; // \
export const isEscapeChar = (c) =>
    [
        0x22, // "
        0x5c, // \
        0x62, // b
        0x66, // f
        0x6e, // n
        0x72, // r
        0x74, // t
        0x75, // u+XXXX
        0x55 // U+XXXXXXXX
    ].indexOf(c) >= 0;
export const isLittleU = (c) => c === 0x75; // u
export const isBigU = (c) => c === 0x55; // U

// Integer
export const isMinus = (c) => c === 0x2d; // -
export const isPlus = (c) => c === 0x2b; // +
export const isUnderscore = (c) => c === 0x5f; // _
export const isDigit1to9 = (c) => c >= 0x31 && c <= 0x39; // 1-9
export const isDigit0to7 = (c) => c >= 0x30 && c <= 0x37; // 0-7
export const isDigit0to1 = (c) => c === 0x30 || c === 0x31; // 0-1
export const isZero = (c) => c === 0x30; // 0
export const isHexPrefix = (c) => c === 0x78; // x
export const isOctPrefix = (c) => c === 0x6f; // o
export const isBinPrefix = (c) => c === 0x62; // b
