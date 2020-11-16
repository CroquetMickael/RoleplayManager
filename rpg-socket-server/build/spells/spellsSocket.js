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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpell = exports.modifySpell = exports.importSpells = exports.addSpell = exports.useSpell = void 0;
var roomHelper_1 = require("../rooms/roomHelper");
var playerHelper_1 = require("../player/playerHelper");
var spellHelper_1 = require("./spellHelper");
var Validator = require("jsonschema").Validator;
var validator = new Validator();
var arraySpellSchema = {
    type: "array",
    items: {
        properties: {
            name: { type: "string" },
            defaultCooldown: { type: "number" },
            currentCooldown: { type: "number" },
            description: { type: "string" },
        },
        required: ["name", "defaultCooldown", "currentCooldown", "description"],
    },
};
function addSpell(socket, rooms) {
    socket.on("addSpell", function (Information) {
        if (!Information) {
            return;
        }
        var playerName = Information.playerName, roomName = Information.roomName, spellName = Information.spellName, spellCooldown = Information.spellCooldown, spellDescription = Information.spellDescription;
        var room = roomHelper_1.getRoom(rooms, roomName);
        var result = spellHelper_1.addSpellToPlayer(room, playerName, {
            spellName: spellName,
            spellCooldown: spellCooldown,
            spellDescription: spellDescription,
        });
        if (result === true) {
            room.lastUsedDate = new Date();
            socket.emit("spellHasBeenAdded", spellName);
        }
    });
}
exports.addSpell = addSpell;
function useSpell(socket, rooms) {
    socket.on("useSpell", function (Information) {
        if (!Information) {
            return;
        }
        var playerName = Information.playerName, roomName = Information.roomName, spellName = Information.spellName;
        var room = roomHelper_1.getRoom(rooms, roomName);
        if (room) {
            var _a = playerHelper_1.getPlayer(room.players, playerName), player = _a.player, indexOfPlayer = _a.indexOfPlayer;
            var _b = spellHelper_1.getPlayerSpell(player, spellName), spell = _b.spell, indexOfSpell = _b.indexOfSpell;
            room.players[indexOfPlayer].spells[indexOfSpell] = __assign(__assign({}, spell), { currentCooldown: Number(spell.defaultCooldown) });
            room.lastUsedDate = new Date();
        }
    });
}
exports.useSpell = useSpell;
function importSpells(socket, rooms) {
    socket.on("importSpells", function (Information) {
        var playerName = Information.playerName, roomName = Information.roomName, spells = Information.spells;
        try {
            var spellsFormated = JSON.parse(spells);
            var validatorResult = validator.validate(spellsFormated, arraySpellSchema);
            if (validatorResult.valid) {
                var room = roomHelper_1.getRoom(rooms, roomName);
                var indexOfPlayer = playerHelper_1.getPlayer(room.players, playerName).indexOfPlayer;
                room.players[indexOfPlayer].spells = spellsFormated;
                room.lastUsedDate = new Date();
                socket.emit("spellsImported");
            }
        }
        catch (error) {
            console.log(error);
            socket.emit("spellBadFormat");
            return;
        }
    });
}
exports.importSpells = importSpells;
function modifySpell(socket, rooms) {
    socket.on("modifySpell", function (Information) {
        if (!Information) {
        }
        var playerName = Information.playerName, roomName = Information.roomName, spellName = Information.spellName, spellCooldown = Information.spellCooldown, spellDescription = Information.spellDescription, spellCurrentCooldown = Information.spellCurrentCooldown, isOwner = Information.isOwner;
        var room = roomHelper_1.getRoom(rooms, roomName);
        var _a = playerHelper_1.getPlayer(room.players, playerName), player = _a.player, indexOfPlayer = _a.indexOfPlayer;
        var _b = spellHelper_1.getPlayerSpell(player, spellName), spell = _b.spell, indexOfSpell = _b.indexOfSpell;
        if (spell.currentCooldown === 0 || isOwner) {
            room.players[indexOfPlayer].spells[indexOfSpell] = {
                name: spellName,
                defaultCooldown: Number(spellCooldown),
                currentCooldown: Number(spellCurrentCooldown),
                description: spellDescription,
            };
            room.lastUsedDate = new Date();
            socket.emit("spellHasBeenModified", spellName);
        }
    });
}
exports.modifySpell = modifySpell;
function deleteSpell(socket, rooms) {
    socket.on("deleteSpell", function (Information) {
        if (!Information) {
        }
        var playerName = Information.playerName, roomName = Information.roomName, spellName = Information.spellName;
        var room = roomHelper_1.getRoom(rooms, roomName);
        var _a = playerHelper_1.getPlayer(room.players, playerName), player = _a.player, indexOfPlayer = _a.indexOfPlayer;
        var indexOfSpell = spellHelper_1.getPlayerSpell(player, spellName).indexOfSpell;
        room.players[indexOfPlayer].spells.splice(indexOfSpell, 1);
        room.lastUsedDate = new Date();
        socket.emit("spellHasBeenDeleted", spellName);
    });
}
exports.deleteSpell = deleteSpell;
