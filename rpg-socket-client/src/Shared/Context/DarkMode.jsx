import React, { createContext, useState } from "react";
import { useStateWithLocalStorage } from "../Hooks/LocalStorageHooks";

const enableDarkMode = (func, boolean) => {
  const htmlElement = document.getElementsByTagName("html")[0];
  const darkHtml = htmlElement.className;
  if (darkHtml.includes("dark")) {
    htmlElement.className = null;
  } else {
    htmlElement.className = "dark";
  }
  func(!boolean);
};

const DarkModeContext = createContext({
  ToggleDarkMode: null,
  isDarkMode: false,
});

const DarkModeProvider = (props) => {
  const [darkMode, setDarkMode] = useStateWithLocalStorage("darkMode", false);
  const ToggleDarkMode = () => enableDarkMode(setDarkMode, darkMode);
  return (
    <DarkModeContext.Provider
      value={{
        ToggleDarkMode,
        isDarkMode: darkMode,
      }}
    >
      {props.children}
    </DarkModeContext.Provider>
  );
};
export { DarkModeContext, DarkModeProvider };
