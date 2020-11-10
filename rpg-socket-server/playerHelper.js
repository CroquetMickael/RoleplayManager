const getPlayer = (players, playerName) => {
  const indexOfPlayer = players.findIndex(
    (player) => player.name === playerName
  );

  return { player: players[indexOfPlayer], indexOfPlayer };
};

module.exports = {
  getPlayer,
};
