const { checkIfStringisNullOrEmpty } = require("../helper");
const { getPlayer } = require("../playerHelper");

function checkSpellInputs(spellName, spellDescription, spellCooldown) {
  if (
    !checkIfStringisNullOrEmpty(spellName) &&
    !checkIfStringisNullOrEmpty(spellDescription) &&
    !checkIfStringisNullOrEmpty(spellCooldown)
  ) {
    return true;
  }
  return false;
}

function getPlayerSpell(player, spellName) {
  const indexOfSpell = player.spells.findIndex(
    (spell) => spell.name === spellName
  );
  return { spell: player.spells[indexOfSpell], indexOfSpell };
}

function addSpellToPlayer(room, playerName, spellToAdd) {
  const { spellName, spellCooldown, spellDescription } = spellToAdd;
  const { player, indexOfPlayer } = getPlayer(room.players, playerName);
  if (
    !room.players[indexOfPlayer].spells.some(
      (spell) => spell.name === spellName
    ) &&
    checkSpellInputs(spellName, spellDescription, spellCooldown)
  ) {
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

module.exports = {
  addSpellToPlayer,
  getPlayerSpell,
};
