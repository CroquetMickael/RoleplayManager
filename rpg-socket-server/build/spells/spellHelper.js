"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerSpell = exports.addSpellToPlayer = void 0;
var playerHelper_1 = require("../player/playerHelper");
var helper_1 = require("../helper");
function checkSpellInputs(spellName, spellDescription, spellCooldown) {
    if (!helper_1.checkIfStringisNullOrEmpty(spellName) &&
        !helper_1.checkIfStringisNullOrEmpty(spellDescription) &&
        !helper_1.checkIfStringisNullOrEmpty(spellCooldown)) {
        return true;
    }
    return false;
}
function getPlayerSpell(player, spellName) {
    var indexOfSpell = player.spells.findIndex(function (spell) { return spell.name === spellName; });
    return { spell: player.spells[indexOfSpell], indexOfSpell: indexOfSpell };
}
exports.getPlayerSpell = getPlayerSpell;
function addSpellToPlayer(room, playerName, spellToAdd) {
    var spellName = spellToAdd.spellName, spellCooldown = spellToAdd.spellCooldown, spellDescription = spellToAdd.spellDescription;
    var indexOfPlayer = playerHelper_1.getPlayer(room.players, playerName).indexOfPlayer;
    if (!room.players[indexOfPlayer].spells.some(function (spell) { return spell.name === spellName; }) &&
        checkSpellInputs(spellName, spellDescription, spellCooldown)) {
        room.players[indexOfPlayer].spells.push({
            name: spellName,
            defaultCooldown: Number(spellCooldown),
            currentCooldown: 0,
            description: spellDescription,
        });
        room.lastUsedDate = new Date();
        return true;
    }
    return false;
}
exports.addSpellToPlayer = addSpellToPlayer;
