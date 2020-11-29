import React from "react";
import { DarkModeButton } from "../Shared/Component/DarkModeButton";

const NavBar = ({ leftside, rightside }) => (
  <nav className="shadow-sm bg-gray-50 dark:bg-gray-800">
    <div className="px-2">
      <div className="relative flex items-center h-16">
        <div className="flex-1">
          <div className="block">{leftside}</div>
        </div>
        {rightside}
        <div className="flex-shrink-0 text-black dark:text-white">
          <DarkModeButton />
        </div>
      </div>
    </div>
  </nav>
);

export { NavBar };
