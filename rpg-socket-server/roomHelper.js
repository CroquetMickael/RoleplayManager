const getRoom = (rooms, roomName) => {
  if (rooms[roomName] === undefined) {
    return;
  }
  return rooms[roomName];
};


module.exports = {
    getRoom
}