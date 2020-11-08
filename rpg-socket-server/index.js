const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const {
  getRoom,
  ExcedMaxPlayer,
  generateRoomPassword,
} = require("./roomHelper");
const {
  getPlayer,
  getPlayerSpell,
  addSpellToPlayer,
} = require("./playerHelper");

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const socket = socketIo(server); // < Interesting!

var rooms = {};
var playersName = [];

socket.on("connection", (socket) => {
  socket.on("joinRoom", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName, roomPassword } = roomInformation;
    playersName.push(playerName);
    const room = getRoom(rooms, roomName);
    if (room && room.owner !== playerName) {
      if (room.password !== roomPassword) {
        socket.emit("wrongPassword");
        return;
      }
      if (ExcedMaxPlayer(room, room.maxPlayer)) {
        return;
      }
      if (!room.players.some((player) => player.name === playerName)) {
        room.players = [
          ...room.players,
          {
            name: playerName,
            spells: [],
          },
        ];
      }
      socket.join(roomName);
      socket.emit("roomJoined");
      socket.to(roomName).emit("PlayerJoined", playerName);
    }
  });

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

  socket.on("useSpell", function (Information) {
    if (!Information) {
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
    }
  });

  socket.on("leaveRoom", function (roomInformation) {
    if (!roomInformation) {
      return;
    }
    const { playerName, roomName } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room) {
      room.players = room.players.filter(
        (player) => player.name !== playerName
      );
      if (room.players.length <= 0 && room.owner !== true) {
        room.owner = room.owner === playerName;
      }
      socket.leave(roomName);
      if (room.players.length <= 0 && room.owner === true) {
        delete rooms[roomName];
      }
    }
  });

  socket.on("addSpell", function (Information) {
    if (!Information) {
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
      socket.emit("spellHasBeenAdded", spellName);
    }
  });

  socket.on("importSpells", function (Information) {
    const { playerName, roomName, spells } = Information;
    const spellsFormated = JSON.parse(spells);
    const room = getRoom(rooms, roomName);
    const { indexOfPlayer } = getPlayer(room.players, playerName);
    room.players[indexOfPlayer].spells = spellsFormated;
  });

  socket.on("modifySpell", function (Information) {
    if (!Information) {
    }
    const {
      playerName,
      roomName,
      spellName,
      spellCooldown,
      spellDescription,
    } = Information;
    const room = getRoom(rooms, roomName);
    const { player, indexOfPlayer } = getPlayer(room.players, playerName);
    const { spell, indexOfSpell } = getPlayerSpell(player, spellName);
    if (spell.currentCooldown === 0) {
      room.players[indexOfPlayer].spells[indexOfSpell] = {
        name: spellName,
        defaultCooldown,
        currentCooldown: spellCooldown,
        description: spellDescription,
      };
      socket.emit("spellHasBeenModified", spellName);
    }
  });

  socket.on("createRoom", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName, maxPlayer } = roomInformation;
    if (isNaN(maxPlayer) && room[roomName] !== null) {
      return;
    }
    socket.join(roomName);
    playersName.push(playerName);
    rooms[roomName] = {
      maxPlayer: Number(maxPlayer),
      owner: playerName,
      players: [],
      password: generateRoomPassword(),
    };
    socket.emit("roomCreated");
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
    }
    socket.to(roomName).emit("RoundEnded");
  });

  socket.on("getRooms", function () {
    socket.emit("rooms", rooms);
  });

  socket.on("getRoomInformation", function (roomName) {
    socket.emit("roomInformation", rooms[roomName]);
  });

  socket.on("getPlayersName", function () {
    socket.emit("playersName", playersName);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
