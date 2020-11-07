import React from "react";
import { Player } from "./Player/Player";
import { Owner } from "./Owner/Owner";

const PersonView = (props) => (
  <>
    {props.roomInformation?.players?.some(
      (player) => player.name === props.playerName && player.owner === true
    ) ? (
      <Owner />
    ) : (
      <Player />
    )}
  </>
);

export { PersonView };
