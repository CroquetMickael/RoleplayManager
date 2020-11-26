import React from "react";
const SpellButton = ({
  children,
  spellClicks,
  className,
  coolDown,
  spellRight,
  isOwner,
}) => (
  <div className="relative w-full">
    {coolDown > 0 && isOwner === false ? (
      <div className="absolute z-10 w-full p-2 text-center text-white bg-black bg-opacity-75 rounded">
        <span>{coolDown}</span>
      </div>
    ) : null}

    <div className="inline-block w-full dropdown">
      <button
        className={`text-center items-center p-2 font-semibold ${className}`}
      >
        <span className="text-white dark:text-white">{children}</span>
      </button>
      <ul className="absolute z-10 hidden pt-1 text-gray-700 dropdown-content">
        {spellRight?.canUse ? (
          <li
            className="block p-2 whitespace-no-wrap bg-gray-200 rounded-t cursor-pointer hover:bg-gray-400"
            onClick={spellClicks?.useSpell}
          >
            Use spell
          </li>
        ) : null}
        <li
          className="block p-2 whitespace-no-wrap bg-gray-200 rounded-t cursor-pointer hover:bg-gray-400"
          onClick={spellClicks?.showSpellDescription}
        >
          Read spell description
        </li>
        {spellRight?.canModify ? (
          <li
            className="block p-2 whitespace-no-wrap bg-gray-200 rounded-t cursor-pointer hover:bg-gray-400"
            onClick={spellClicks.modifySpell}
          >
            Modify spell
          </li>
        ) : null}
        {spellRight?.canDelete ? (
          <li
            className="block p-2 whitespace-no-wrap bg-gray-200 rounded-t cursor-pointer hover:bg-gray-400"
            onClick={spellClicks.deleteSpell}
          >
            Delete spell
          </li>
        ) : null}
      </ul>
    </div>
  </div>
);

export { SpellButton };
