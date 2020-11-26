import React, { createContext } from "react";
import { useStateWithLocalStorage } from "../Hooks/LocalStorageHooks";

const UserContext = createContext();

const UserProvider = (props) => {
  const [playerName, setPlayerName] = useStateWithLocalStorage(
    "playername",
    ""
  );
  const checkPlayerNameExists = () => {
    if (playerName === "" || playerName === null) {
      return false;
    }
    return true;
  };
  return (
    <UserContext.Provider
      value={{
        playerName,
        setPlayerName,
        checkPlayerNameExists,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
