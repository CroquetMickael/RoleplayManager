const getRoom = (rooms, roomName) => {
  if (rooms[roomName] === undefined) {
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

module.exports = {
  getRoom,
  ExcedMaxPlayer
};
