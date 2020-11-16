import { PlayerModel } from "./playerModel";

const getPlayer = (players: Array<PlayerModel>, playerName: string) => {
  const indexOfPlayer: number = players.findIndex(
    (player: PlayerModel) => player.name === playerName
  );

  return { player: players[indexOfPlayer], indexOfPlayer };
};

export { getPlayer };
