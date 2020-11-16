import { RoomModel } from "./roomModel";

const getRoom = (rooms: any, roomName: string) => {
  if (rooms[roomName] === "undefined" || rooms[roomName] === null) {
    return;
  }
  return rooms[roomName];
};

const ExcedMaxPlayer = (room: RoomModel) => {
  if (room.players.length + 1 > room.maxPlayer) {
    return true;
  }
  return false;
};
const generateRoomPassword = () => Math.random().toString(36).slice(-8);

export { getRoom, generateRoomPassword, ExcedMaxPlayer };

