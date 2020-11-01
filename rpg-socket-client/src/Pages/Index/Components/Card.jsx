import React from "react";
import { Button } from "../../Shared/Component/Button/Button";

const CardGame = (props) => (
  <div className="bg-white rounded-lg shadow-md">
    <div className="p-4">
      <div className="flex flex-col items-center justify-between">
        <h2 className="-mt-1 text-lg font-semibold text-gray-900">
          {props.roomName}
        </h2>
        <small className="text-sm text-gray-700">
          {props.playersNumber}/{props.maxPlayer}
        </small>
      </div>
      {props.maxPlayer === props.players.length ? (
        <Button>Room is full</Button>
      ) : (
        <Button onClick={props.onClick}>Join game</Button>
      )}
    </div>
  </div>
);

export { CardGame };
