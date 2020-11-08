import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = (props) => {
  const useStateWithLocalStorage = (localStorageKey, defaultValue) => {
    const [value, setValue] = useState(
      localStorage.getItem(localStorageKey) || defaultValue
    );

    React.useEffect(() => {
      localStorage.setItem(localStorageKey, value);
    }, [localStorageKey, value]);

    return [value, setValue];
  };

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
        checkPlayerNameExists
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
