import { Socket } from "socket.io";
import { RoomObject } from "../rooms/roomModel";

import { getRoom } from "../rooms/roomHelper";
import { getPlayer } from "../player/playerHelper";
import { getPlayerSpell, addSpellToPlayer } from "./spellHelper";

const Validator = require("jsonschema").Validator;
const validator = new Validator();
const arraySpellSchema = {
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

function addSpell(socket: Socket, rooms: RoomObject) {
  socket.on("addSpell", function (Information) {
    if (!Information) {
      return;
    }
    const {
      playerName,
      roomName,
      spellName,
      spellCooldown,
      spellDescription,
    } = Information;
    const room = getRoom(rooms, roomName);
    const result = addSpellToPlayer(room, playerName, {
      spellName,
      spellCooldown,
      spellDescription,
    });
    if (result === true) {
      room.lastUsedDate = new Date();
      socket.emit("spellHasBeenAdded", spellName);
    }
  });
}

function useSpell(socket: Socket, rooms: RoomObject) {
  socket.on("useSpell", function (Information) {
    if (!Information) {
      return;
    }
    const { playerName, roomName, spellName } = Information;
    const room = getRoom(rooms, roomName);
    if (room) {
      const { player, indexOfPlayer } = getPlayer(room.players, playerName);
      const { spell, indexOfSpell } = getPlayerSpell(player, spellName);
      room.players[indexOfPlayer].spells[indexOfSpell] = {
        ...spell,
        currentCooldown: Number(spell.defaultCooldown),
      };
      room.lastUsedDate = new Date();
    }
  });
}

function importSpells(socket: Socket, rooms: RoomObject) {
  socket.on("importSpells", function (Information) {
    const { playerName, roomName, spells } = Information;

    try {
      const spellsFormated = JSON.parse(spells);
      const validatorResult = validator.validate(
        spellsFormated,
        arraySpellSchema
      );
      if (validatorResult.valid) {
        const room = getRoom(rooms, roomName);
        const { indexOfPlayer } = getPlayer(room.players, playerName);
        room.players[indexOfPlayer].spells = spellsFormated;
        room.lastUsedDate = new Date();
        socket.emit("spellsImported");
      }
    } catch (error) {
      console.log(error);
      socket.emit("spellBadFormat");
      return;
    }
  });
}

function modifySpell(socket: Socket, rooms: RoomObject) {
  socket.on("modifySpell", function (Information) {
    if (!Information) {
    }
    const {
      playerName,
      roomName,
      spellName,
      spellCooldown,
      spellDescription,
      spellCurrentCooldown,
      isOwner
    } = Information;
    const room = getRoom(rooms, roomName);
    const { player, indexOfPlayer } = getPlayer(room.players, playerName);
    const { spell, indexOfSpell } = getPlayerSpell(player, spellName);
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

function deleteSpell(socket: Socket, rooms: RoomObject) {
  socket.on("deleteSpell", function (Information) {
    if (!Information) {
    }
    const { playerName, roomName, spellName } = Information;
    const room = getRoom(rooms, roomName);
    const { player, indexOfPlayer } = getPlayer(room.players, playerName);
    const { indexOfSpell } = getPlayerSpell(player, spellName);
    room.players[indexOfPlayer].spells.splice(indexOfSpell, 1);
    room.lastUsedDate = new Date();
    socket.emit("spellHasBeenDeleted", spellName);
  });
}

export {
  useSpell,
  addSpell,
  importSpells,
  modifySpell,
  deleteSpell
}
