import { Socket } from "socket.io";
import { PlayerModel } from "../player/playerModel";
import { ExcedMaxPlayer, generateRoomPassword, getRoom } from "./roomHelper";
import { RoomObject } from "./roomModel";

function createRoom(socket: Socket, rooms: RoomObject) {
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

function joinRoom(socket: Socket, rooms: RoomObject) {
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
      if (ExcedMaxPlayer(room)) {
        return;
      }
      if (!room.players.some((player: PlayerModel) => player.name === playerName)) {
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

function leaveRoom(socket: Socket, rooms: RoomObject) {
  socket.on("leaveRoom", function (roomInformation) {
    if (!roomInformation) {
      return;
    }
    const { playerName, roomName } = roomInformation;
    const room = getRoom(rooms, roomName);
    if (room) {
      room.players = room.players.filter(
        (player: PlayerModel) => player.name !== playerName
      );
      if (playerName === room.owner) {
        room.isOwnerConnected = false;
      }
      socket.leave(roomName);
    }
  });
}

function modifyRoomPassword(socket: Socket, rooms: RoomObject) {
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

function getRooms(socket: Socket, rooms: RoomObject) {
  socket.on("getRooms", function () {
    socket.emit("rooms", rooms);
  });
}

function getRoomInformation(socket: Socket, rooms: RoomObject) {
  socket.on("getRoomInformation", function (roomName) {
    socket.emit("roomInformation", rooms[roomName]);
  });
}

export {
  joinRoom,
  getRooms,
  createRoom,
  leaveRoom,
  getRoomInformation,
  modifyRoomPassword,
}
