import React from "react";
import { useNavigate } from "react-router";

const CardGame = (props) => {
  const navigation = useNavigate();
  return (
    <div className="w-1/3 bg-white rounded-lg shadow-md ">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="-mt-1 text-lg font-semibold text-gray-900">
            {props.roomName}
          </h2>
          <small className="text-sm text-gray-700">
            {props.playersNumber}/{props.roomMaxPlayer}
          </small>
        </div>
        <p className="pt-3 text-sm text-gray-700">
          players :{" "}
          {props.players.map((player) => (
            <span key={player.name}>{player.name} </span>
          ))}
        </p>
        <button
          className="w-full py-2 my-2 text-white bg-blue-400 rounded-sm hover:bg-blue-600"
          onClick={() => {
            navigation(`/game/${props.roomName}`);
          }}
        >
          {" "}
          Join game
        </button>
      </div>
    </div>
  );
};

export { CardGame };
