import React, { useEffect, useState } from "react";

const PlayerNameForm = ({ setIsModalOpen, setPlayerName, playerName }) => {
  const [localPlayerName, setLocalPlayerName] = useState("");

  useEffect(() => {
    if (playerName !== "" || null) {
      setLocalPlayerName(playerName);
    }
  }, [playerName]);

  const onSave = () => {
    setPlayerName(localPlayerName);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col">
      <input
        className="p-2 mb-1 border border-black"
        placeholder="Please insert your player name"
        value={localPlayerName}
        onChange={(event) => setLocalPlayerName(event.target.value)}
      ></input>
      <button
        className="flex items-center justify-center w-full h-8 p-2 text-white bg-blue-300 rounded hover:bg-blue-500"
        onClick={() => onSave()}
      >
        Save change
      </button>
    </div>
  );
};

export { PlayerNameForm };
