import socketIo, { Socket } from "socket.io";
import { createServer } from "http";
import express from "express"

import { getRoom } from "./rooms/roomHelper"
import {
  joinRoom,
  getRooms,
  leaveRoom,
  createRoom,
  getRoomInformation,
  modifyRoomPassword,
} from "./rooms/roomsSocket"
import { PlayerModel } from "./player/playerModel";
import { SpellModel } from "./spells/spellModel";
import {
  addSpell,
  useSpell,
  importSpells,
  modifySpell,
  deleteSpell
} from "./spells/spellsSocket"
import { RoomObject } from "./rooms/roomModel";

const port = process.env.PORT || 4001;

const app = express();

const server = createServer(app);

const socket = socketIo(server);

var rooms: RoomObject = {};
var playersName: Array<String> = [];

const thirtyMinute = 1800000;

setInterval(() => {
  Object.keys((rooms)).map((key) => {
    if (new Date().getMonth() - rooms[key].lastUsedDate.getMonth() === 1) {
      delete rooms[key];
    }
  });
}, thirtyMinute);

socket.on("connection", (socket: Socket) => {
  //room socket
  joinRoom(socket, rooms);
  getRooms(socket, rooms);
  leaveRoom(socket, rooms);
  createRoom(socket, rooms);
  getRoomInformation(socket, rooms);
  modifyRoomPassword(socket, rooms);

  //spell socket
  addSpell(socket, rooms);
  useSpell(socket, rooms);
  importSpells(socket, rooms);
  modifySpell(socket, rooms);
  deleteSpell(socket, rooms);

  socket.on("checkPlayer", function (roomInformation) {
    if (!roomInformation) {
      return;
    }
    const { playerName, roomName } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room) {
      if (!room.owner === playerName) {
        const currentPlayers = room.players.filter(
          (player: PlayerModel) => player.name === playerName
        );
        if (currentPlayers.length === 0) {
          socket.emit("playerNotAllowed");
        }
      }
    }
  });

  socket.on("endOfRound", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room.owner === playerName) {
      room.players.forEach((player: PlayerModel) => {
        player.spells.forEach((spell: SpellModel) => {
          if (spell.currentCooldown !== 0) {
            spell = {
              ...spell,
              currentCooldown: spell.currentCooldown--,
            };
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

server.listen(port, () => console.log(`Listening on port ${port}`));
