const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const { getRoom, isRoomExist } = require("./roomHelper");

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const socket = socketIo(server); // < Interesting!

var rooms = {};
var generateRoomPassword = () => Math.random().toString(36).slice(-8);

socket.on("connection", (socket) => {
  socket.on("joinRoom", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName, roomPassword } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room) {
      if (room.password !== roomPassword) {
        socket.emit("wrongPassword");
        return;
      }
      if (room.players.length + 1 > room.maxPlayer) {
        return;
      }
      if (!room.players.some((player) => player.name === playerName)) {
        room.players = [...room.players, { name: playerName }];
      }
      socket.join(roomName);
      socket.emit("roomJoined");
    }
  });

  socket.on("checkPlayer", function (roomInformation) {
    if (!roomInformation) {
      return;
    }
    const { playerName, roomName } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room) {
      if (
        !room.players.some(
          (player) => player.owner === true && player.name === playerName
        )
      ) {
        const currentPlayers = room.players.filter(
          (player) => player.name === playerName
        );
        if (currentPlayers.length === 0) {
          socket.emit("playerNotAllowed");
        }
      }
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
      socket.leave(roomName);
      if (room.players.length <= 0) {
        delete rooms[roomName];
      }
    }
  });

  socket.on("createRoom", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName, maxPlayer } = roomInformation;
    socket.join(roomName);
    rooms[roomName] = {
      maxPlayer: Number(maxPlayer),
      players: [{ name: playerName, owner: true }],
      password: generateRoomPassword(),
    };
  });

  socket.on("getRooms", function () {
    socket.emit("rooms", rooms);
  });

  socket.on("getRoomInformation", function (roomName) {
    socket.emit("roomInformation", rooms[roomName]);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
