import React, { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { DarkModeContext } from "../Context/DarkMode";

const DarkModeButton = () => {
  const { ToggleDarkMode, isDarkMode } = useContext(DarkModeContext);
  return (
    <button
      onClick={ToggleDarkMode}
      className="mt-4 mr-4 no-underline lg:inline-block lg:mt-0"
    >
      {isDarkMode ? (
        <FaMoon className="mx-auto text-3xl text-black" />
      ) : (
        <FaSun className="mx-auto text-3xl text-white" />
      )}
    </button>
  );
};

export { DarkModeButton };
