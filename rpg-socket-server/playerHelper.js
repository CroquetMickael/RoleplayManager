const { checkIfStringisNullOrEmpty } = require("./helper");

const checkSpellInputs = (spellName, spellDescription, spellCooldown) => {
  if (
    !checkIfStringisNullOrEmpty(spellName) &&
    !checkIfStringisNullOrEmpty(spellDescription) &&
    !checkIfStringisNullOrEmpty(spellCooldown)
  ) {
    return true;
  }
  return false;
};
const getPlayer = (players, playerName) => {
  const indexOfPlayer = players.findIndex(
    (player) => player.name === playerName
  );

  return { player: players[indexOfPlayer], indexOfPlayer };
};

const getPlayerSpell = (player, spellName) => {
  const indexOfSpell = player.spells.findIndex(
    (spell) => spell.name === spellName
  );
  return { spell: player.spells[indexOfSpell], indexOfSpell };
};

const addSpellToPlayer = (room, playerName, spellToAdd) => {
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
    return true;
  }
  return false;
};

module.exports = {
  getPlayer,
  getPlayerSpell,
  addSpellToPlayer,
};
