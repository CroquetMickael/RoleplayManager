import { PlayerModel } from "../player/playerModel";
import { RoomModel } from "../rooms/roomModel";
import { getPlayer } from "../player/playerHelper"
import { checkIfStringisNullOrEmpty } from "../helper"
import { SpellAddModel } from "./spellModel";

function checkSpellInputs(spellName: string, spellDescription: string, spellCooldown: string) {
  if (
    !checkIfStringisNullOrEmpty(spellName) &&
    !checkIfStringisNullOrEmpty(spellDescription) &&
    !checkIfStringisNullOrEmpty(spellCooldown)
  ) {
    return true;
  }
  return false;
}

function getPlayerSpell(player: PlayerModel, spellName: string) {
  const indexOfSpell: number = player.spells.findIndex(
    (spell) => spell.name === spellName
  );
  return { spell: player.spells[indexOfSpell], indexOfSpell };
}

function addSpellToPlayer(room: RoomModel, playerName: string, spellToAdd: SpellAddModel) {
  const { spellName, spellCooldown, spellDescription } = spellToAdd;
  const { indexOfPlayer } = getPlayer(room.players, playerName);
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

export { addSpellToPlayer, getPlayerSpell };
