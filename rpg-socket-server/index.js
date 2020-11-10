const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const { getRoom } = require("./rooms/roomHelper");

const { getPlayer } = require("./playerHelper");

const {
  joinRoom,
  getRooms,
  leaveRoom,
  createRoom,
  getRoomInformation,
  modifyRoomPassword,
} = require("./rooms/roomsSocket");
const {
  addSpell,
  useSpell,
  importSpells,
  modifySpell,
  deleteSpell,
} = require("./spells/spellsSocket");

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const socket = socketIo(server);

var rooms = {};
var playersName = [];

const thirtyMinute = 1800000;

setInterval(() => {
  Object.keys(rooms).map((key) => {
    if (new Date().getMonth() - rooms[key].lastUsedDate.getMonth() === 1) {
      delete rooms[key];
    }
  });
}, thirtyMinute);

socket.on("connection", (socket) => {
  //room socket
  joinRoom(socket, rooms, playersName);
  getRooms(socket, rooms);
  leaveRoom(socket, rooms);
  createRoom(socket, rooms, playersName);
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
          (player) => player.name === playerName
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
      room.players.forEach((player) => {
        player.spells.forEach((spell) => {
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
