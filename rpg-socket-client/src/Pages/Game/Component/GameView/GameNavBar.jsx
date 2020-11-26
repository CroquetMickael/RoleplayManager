import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DarkModeButton } from "../../../../Shared/Component/DarkModeButton";

const GameNavBar = () => (
  <nav className="shadow-sm bg-gray-50 dark:bg-gray-800">
    <div className="px-2">
      <div className="relative flex items-center h-16">
        <div className="flex-1">
          <div className="block">
            <Link to="/lobby" className="inline-block">
              <button className="flex items-center dark:text-white">
                <FaArrowLeft className="mx-2 text-black dark:text-white" /> Disconnect from the game
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 mx-2 text-black dark:text-white">
          LOGO
        </div>
        <div className="flex-shrink-0 text-black dark:text-white">
          <DarkModeButton />
        </div>
      </div>
    </div>
  </nav>
);

export { GameNavBar };
