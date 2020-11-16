"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayer = void 0;
var getPlayer = function (players, playerName) {
    var indexOfPlayer = players.findIndex(function (player) { return player.name === playerName; });
    return { player: players[indexOfPlayer], indexOfPlayer: indexOfPlayer };
};
exports.getPlayer = getPlayer;
