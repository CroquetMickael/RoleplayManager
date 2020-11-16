"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfStringisNullOrEmpty = void 0;
var checkIfStringisNullOrEmpty = function (string) {
    if (string === "" || string === null) {
        return true;
    }
    return false;
};
exports.checkIfStringisNullOrEmpty = checkIfStringisNullOrEmpty;
