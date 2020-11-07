import React from "react";

const GameInformation = (props) => (
  <div className="w-full shadow-xs">
    <p className="font-bold">Game name: {props.roomName}</p>
    players :{" "}
    {props.roomInformation?.players?.map((player, index) => (
      <span key={player.name}>{player.name} </span>
    ))}
    room password : {props.roomInformation?.password}
  </div>
);

export { GameInformation };
