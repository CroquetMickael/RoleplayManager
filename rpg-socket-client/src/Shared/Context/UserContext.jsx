import React, { createContext, useContext, useEffect, useState } from "react";
import { useStateWithLocalStorage } from "../Hooks/LocalStorageHooks";
import { SocketContext } from "./SocketContext";

const UserContext = createContext();

const UserProvider = (props) => {
  const { socket } = useContext(SocketContext);
  const [playerName, setPlayerName] = useStateWithLocalStorage(
    "playername",
    ""
  );
  const [playerId, setPlayerId] = useState('');
  const checkPlayerNameExists = () => {
    if (playerName === "" || playerName === null) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (playerName !== "") {
      socket.emit("getPlayerId", playerName);
      socket.on("playerIdReturn", (playerId) => {
        setPlayerId(playerId);
      });
    }
  }, [playerId, playerName]);

  return (
    <UserContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerId,
        checkPlayerNameExists,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
