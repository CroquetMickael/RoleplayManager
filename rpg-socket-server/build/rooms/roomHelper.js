"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcedMaxPlayer = exports.generateRoomPassword = exports.getRoom = void 0;
var getRoom = function (rooms, roomName) {
    if (rooms[roomName] === "undefined" || rooms[roomName] === null) {
        return;
    }
    return rooms[roomName];
};
exports.getRoom = getRoom;
var ExcedMaxPlayer = function (room) {
    if (room.players.length + 1 > room.maxPlayer) {
        return true;
    }
    return false;
};
exports.ExcedMaxPlayer = ExcedMaxPlayer;
var generateRoomPassword = function () { return Math.random().toString(36).slice(-8); };
exports.generateRoomPassword = generateRoomPassword;
