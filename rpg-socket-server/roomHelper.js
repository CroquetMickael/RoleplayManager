const getRoom = (rooms, roomName) => {
  if (rooms[roomName] === "undefined" || rooms[roomName] === null) {
    return;
  }
  return rooms[roomName];
};

module.exports = {
  getRoom,
};
