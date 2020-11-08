const getRoom = (rooms, roomName) => {
  if (rooms[roomName] === "undefined" || rooms[roomName] === null) {
    return;
  }
  return rooms[roomName];
};

const ExcedMaxPlayer = (room, maxPlayer) => {
  if (room.players.length + 1 > room.maxPlayer) {
    return true;
  }
  return false;
};
const generateRoomPassword = () => Math.random().toString(36).slice(-8);
module.exports = {
  getRoom,
  generateRoomPassword,
  ExcedMaxPlayer,
};
