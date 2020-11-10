const {
  ExcedMaxPlayer,
  generateRoomPassword,
  getRoom,
} = require("./roomHelper");

function createRoom(socket, rooms, playersName) {
  socket.on("createRoom", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName, maxPlayer } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (isNaN(maxPlayer) || (room != null && room != "undefined")) {
      return;
    }
    socket.join(roomName);
    rooms[roomName] = {
      maxPlayer: Number(maxPlayer),
      owner: playerName,
      players: [],
      password: generateRoomPassword(),
      lastUsedDate: new Date(),
      isOwnerConnected: true,
    };
    socket.emit("roomCreated");
  });
}

function joinRoom(socket, rooms, playersName) {
  socket.on("joinRoom", function (roomInformation) {
    if (!roomInformation) {
    }
    const { playerName, roomName, roomPassword } = roomInformation;
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
      room.lastUsedDate = new Date();
      socket.emit("roomJoined");
      socket.to(roomName).emit("PlayerJoined", playerName);
    }
    if (room.owner === playerName && room.password === roomPassword) {
      socket.emit("roomJoined");
      room.isOwnerConnected = true;
      socket.to(roomName).emit("GMJoined");
    }
  });
}

function leaveRoom(socket, rooms) {
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
      if (playerName === room.owner) {
        room.isOwnerConnected = false;
      }
      socket.leave(roomName);
    }
  });
}

function modifyRoomPassword(socket, rooms) {
  socket.on("modifyRoomPassword", function (roomInformation) {
    if (!roomInformation) {
      return;
    }
    const { playerName, roomName, password } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room) {
      if (playerName === room.owner) {
        room.password = password;
        socket.emit("roomPasswordChanged");
      }
    }
  });
}

function getRooms(socket, rooms) {
  socket.on("getRooms", function () {
    socket.emit("rooms", rooms);
  });
}

function getRoomInformation(socket, rooms) {
  socket.on("getRoomInformation", function (roomName) {
    socket.emit("roomInformation", rooms[roomName]);
  });
}

module.exports = {
  joinRoom,
  getRooms,
  createRoom,
  leaveRoom,
  getRoomInformation,
  modifyRoomPassword,
};
