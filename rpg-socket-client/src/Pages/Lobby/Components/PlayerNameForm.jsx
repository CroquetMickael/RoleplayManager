import React from "react";

const PlayerNameForm = ({ setIsModalOpen, setPlayerName, playerName }) => (
  <div className="flex flex-col">
    <input
      className="p-2 mb-1 border border-black"
      placeholder="Please insert your player name"
      value={playerName}
      onChange={(event) => setPlayerName(event.target.value)}
    ></input>
    <button
      className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
      onClick={() => setIsModalOpen(false)}
    >
      Save change
    </button>
  </div>
);

export { PlayerNameForm };
