"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyRoomPassword = exports.getRoomInformation = exports.leaveRoom = exports.createRoom = exports.getRooms = exports.joinRoom = void 0;
var roomHelper_1 = require("./roomHelper");
function createRoom(socket, rooms) {
    socket.on("createRoom", function (roomInformation) {
        if (!roomInformation) {
        }
        var playerName = roomInformation.playerName, roomName = roomInformation.roomName, maxPlayer = roomInformation.maxPlayer;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (isNaN(maxPlayer) || (room != null && room != "undefined")) {
            return;
        }
        socket.join(roomName);
        rooms[roomName] = {
            maxPlayer: Number(maxPlayer),
            owner: playerName,
            players: [],
            password: roomHelper_1.generateRoomPassword(),
            lastUsedDate: new Date(),
            isOwnerConnected: true,
        };
        socket.emit("roomCreated");
    });
}
exports.createRoom = createRoom;
function joinRoom(socket, rooms) {
    socket.on("joinRoom", function (roomInformation) {
        if (!roomInformation) {
        }
        var playerName = roomInformation.playerName, roomName = roomInformation.roomName, roomPassword = roomInformation.roomPassword;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (room && room.owner !== playerName) {
            if (room.password !== roomPassword) {
                socket.emit("wrongPassword");
                return;
            }
            if (roomHelper_1.ExcedMaxPlayer(room)) {
                return;
            }
            if (!room.players.some(function (player) { return player.name === playerName; })) {
                room.players = __spreadArrays(room.players, [
                    {
                        name: playerName,
                        spells: [],
                    },
                ]);
            }
            socket.join(roomName);
            room.lastUsedDate = new Date();
            socket.emit("roomJoined");
            socket.to(roomName).emit("PlayerJoined", playerName);
        }
        if (room.owner === playerName && room.password === roomPassword) {
            socket.emit("roomJoined");
            room.isOwnerConnected = true;
            socket.to(roomName).emit("GMJoined");
        }
    });
}
exports.joinRoom = joinRoom;
function leaveRoom(socket, rooms) {
    socket.on("leaveRoom", function (roomInformation) {
        if (!roomInformation) {
            return;
        }
        var playerName = roomInformation.playerName, roomName = roomInformation.roomName;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (room) {
            room.players = room.players.filter(function (player) { return player.name !== playerName; });
            if (playerName === room.owner) {
                room.isOwnerConnected = false;
            }
            socket.leave(roomName);
        }
    });
}
exports.leaveRoom = leaveRoom;
function modifyRoomPassword(socket, rooms) {
    socket.on("modifyRoomPassword", function (roomInformation) {
        if (!roomInformation) {
            return;
        }
        var playerName = roomInformation.playerName, roomName = roomInformation.roomName, password = roomInformation.password;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (room) {
            if (playerName === room.owner) {
                room.password = password;
                socket.emit("roomPasswordChanged");
            }
        }
    });
}
exports.modifyRoomPassword = modifyRoomPassword;
function getRooms(socket, rooms) {
    socket.on("getRooms", function () {
        socket.emit("rooms", rooms);
    });
}
exports.getRooms = getRooms;
function getRoomInformation(socket, rooms) {
    socket.on("getRoomInformation", function (roomName) {
        socket.emit("roomInformation", rooms[roomName]);
    });
}
exports.getRoomInformation = getRoomInformation;
