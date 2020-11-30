import React, { useEffect, useState } from "react";
import { ErrorForm } from "../../../Shared/Component/ErrorForm/ErrorForm";

const PlayerNameForm = ({
  setIsModalOpen,
  setPlayerName,
  playerName,
  socket,
  createPlayer,
}) => {
  const [localPlayerName, setLocalPlayerName] = useState("");
  const [error, setError] = useState("");
  const [isValidPlayer, setIsValidPlayer] = useState(false);
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      socket.emit("checkPlayerName", localPlayerName);
    }, 500);
    socket.on("checkPlayerReturn", (isValid) => {
      setIsValidPlayer(isValid);
      if (!isValid) {
        setError(
          <>
            <p className="font-bold">Player already exits</p>
            <hr />
            <p className="text-black">
              Check you don't use private mode for this website.
              <br /> If you already used the site
            </p>
          </>
        );
      } else {
        setError("");
      }
    });
    return () => clearTimeout(delayDebounceFn);
  }, [localPlayerName, socket]);

  useEffect(() => {
    if (playerName !== "" || null) {
      setLocalPlayerName(playerName);
    }
  }, [playerName]);

  const onSave = () => {
    if ((isValidPlayer && playerName === "") || isAlreadyUser) {
      setPlayerName(localPlayerName);
      if (!isAlreadyUser) {
        createPlayer(localPlayerName);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <input
        className="p-2 mb-1 border border-black"
        placeholder="Please insert your player name"
        value={localPlayerName}
        onChange={(event) => setLocalPlayerName(event.target.value)}
      ></input>
      <ErrorForm>{error}</ErrorForm>
      {!isValidPlayer ? (
        <label className="inline-flex items-center mt-3">
          <input
            type="checkbox"
            className="w-5 h-5 text-red-600 form-checkbox"
            onChange={(e) => {
              console.log(e)
              setIsAlreadyUser(e.target.checked)}}
            value={isAlreadyUser}
          ></input>
          <span className="px-2">
            I assume, that I have already used this website before and this is my pseudo
          </span>
        </label>
      ) : null}
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
