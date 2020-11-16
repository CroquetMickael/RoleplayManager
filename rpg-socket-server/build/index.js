"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = require("http");
var express_1 = __importDefault(require("express"));
var roomHelper_1 = require("./rooms/roomHelper");
var roomsSocket_1 = require("./rooms/roomsSocket");
var spellsSocket_1 = require("./spells/spellsSocket");
var port = process.env.PORT || 4001;
var app = express_1.default();
var server = http_1.createServer(app);
var socket = socket_io_1.default(server);
var rooms = {};
var playersName = [];
var thirtyMinute = 1800000;
setInterval(function () {
    Object.keys(rooms).map(function (key) {
        if (new Date().getMonth() - rooms[key].lastUsedDate.getMonth() === 1) {
            delete rooms[key];
        }
    });
}, thirtyMinute);
socket.on("connection", function (socket) {
    //room socket
    roomsSocket_1.joinRoom(socket, rooms);
    roomsSocket_1.getRooms(socket, rooms);
    roomsSocket_1.leaveRoom(socket, rooms);
    roomsSocket_1.createRoom(socket, rooms);
    roomsSocket_1.getRoomInformation(socket, rooms);
    roomsSocket_1.modifyRoomPassword(socket, rooms);
    //spell socket
    spellsSocket_1.addSpell(socket, rooms);
    spellsSocket_1.useSpell(socket, rooms);
    spellsSocket_1.importSpells(socket, rooms);
    spellsSocket_1.modifySpell(socket, rooms);
    spellsSocket_1.deleteSpell(socket, rooms);
    socket.on("checkPlayer", function (roomInformation) {
        if (!roomInformation) {
            return;
        }
        var playerName = roomInformation.playerName, roomName = roomInformation.roomName;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (room) {
            if (!room.owner === playerName) {
                var currentPlayers = room.players.filter(function (player) { return player.name === playerName; });
                if (currentPlayers.length === 0) {
                    socket.emit("playerNotAllowed");
                }
            }
        }
    });
    socket.on("endOfRound", function (roomInformation) {
        if (!roomInformation) {
        }
        var playerName = roomInformation.playerName, roomName = roomInformation.roomName;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (room.owner === playerName) {
            room.players.forEach(function (player) {
                player.spells.forEach(function (spell) {
                    if (spell.currentCooldown !== 0) {
                        spell = __assign(__assign({}, spell), { currentCooldown: spell.currentCooldown-- });
                    }
                });
            });
            room.lastUsedDate = new Date();
        }
        socket.to(roomName).emit("RoundEnded");
    });
    socket.on("getPlayersName", function () {
        socket.emit("playersName", playersName);
    });
});
server.listen(port, function () { return console.log("Listening on port " + port); });
