"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTokens(amount) {
    let result = [];
    for (let i = amount; i > 0; i--) {
        result.push(i - 1);
    }
    return result;
}
exports.getTokens = getTokens;