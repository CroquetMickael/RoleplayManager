import React, { useEffect } from "react";
import { SpellButton } from "./SpellButton";
import { SpellDescription } from "./SpellDescription";
import { SpellForm } from "./Forms/AddSpellForm";
import { ImportsSpellsForm } from "./Forms/ImportsSpellsForm";

const SpellsView = ({
  spells,
  canModify,
  socket,
  currentPlayerName,
  playerName,
  roomName,
  isOwner,
  ShowAndSetAlertContent,
  ShowAndSetModalContent,
}) => {
  const addSpell = (spellName, spellCooldown, spellDescription) => {
    socket.emit("addSpell", {
      playerName,
      roomName,
      spellName,
      spellCooldown,
      spellDescription,
    });
  };

  const importSpells = (spells) => {
    socket.emit("importSpells", {
      playerName,
      roomName,
      spells,
    });
  };

  const spellUse = (spellName) => {
    if (currentPlayerName === playerName) {
      socket.emit("useSpell", { playerName, roomName, spellName });
    }
  };

  const showSpellDescription = (spellName, spellDescription, spellCooldown) => {
    ShowAndSetModalContent(
      spellName,
      <SpellDescription
        cooldown={spellCooldown}
        description={spellDescription}
      />
    );
  };

  useEffect(() => {
    if (socket) {
      socket.on("spellHasBeenAdded", function (spellName) {
        ShowAndSetAlertContent(
          "Spell Added",
          `Spell ${spellName} has been added`
        );
      });
    }
  }, [socket]);

  return (
    <div>
      {spells?.length === 0 ? (
        <div className="w-full text-xl font-bold text-center">No spells !</div>
      ) : null}
      <div className="grid grid-cols-6 gap-4">
        {spells?.map((spell) =>
          spell.currentCooldown === 0 && canModify === false ? (
            <SpellButton
              className="w-full bg-blue-400 rounded hover:bg-blue-700"
              textClassName="text-white"
              spellClicks={{
                showSpellDescription: () =>
                  showSpellDescription(
                    spell.name,
                    spell.description,
                    spell.defaultCooldown
                  ),
              }}
            >
              {spell.name}
            </SpellButton>
          ) : spell.currentCooldown === 0 && canModify && isOwner === false ? (
            <SpellButton
              className="w-full bg-blue-400 rounded hover:bg-blue-700"
              textClassName="text-white"
              spellRight={{
                canModify: true,
                canDelete: true,
                canUse: true,
              }}
              spellClicks={{
                useSpell: () => spellUse(spell.name),
                showSpellDescription: () =>
                  showSpellDescription(
                    spell.name,
                    spell.description,
                    spell.defaultCooldown
                  ),
              }}
            >
              {spell.name}
            </SpellButton>
          ) : (
            <SpellButton
              className="w-full bg-blue-400 rounded hover:bg-blue-700"
              textClassName="text-white"
              coolDown={spell.currentCooldown}
              spellRight={{
                canModify: true,
                canDelete: true,
                canUse: false,
              }}
              spellClicks={{
                showSpellDescription: () =>
                  showSpellDescription(
                    spell.name,
                    spell.description,
                    spell.defaultCooldown
                  ),
              }}
            >
              {spell.name}
            </SpellButton>
          )
        )}
      </div>
      {canModify ? (
        <>
          <button
            className="flex items-center justify-center w-full h-8 p-2 m-2 text-white bg-blue-300 rounded hover:bg-blue-500"
            onClick={() =>
              ShowAndSetModalContent(
                "Add a spell",
                <SpellForm addSpell={addSpell} />
              )
            }
          >
            Add a spell
          </button>
          <div className="flex">
            {spells?.length !== 0 && canModify ? (
              <a
                className="flex items-center justify-center w-full p-2 m-2 text-center text-white bg-blue-300 rounded hover:bg-blue-500"
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(spells)
                )}`}
                download={`${playerName}_spells.json`}
              >
                Export Spells
              </a>
            ) : null}
            <button
              className="flex items-center justify-center w-full h-8 p-2 m-2 text-white bg-blue-300 rounded hover:bg-blue-500"
              onClick={() =>
                ShowAndSetModalContent(
                  "Imports Spells",
                  <ImportsSpellsForm importSpells={importSpells} />
                )
              }
            >
              Imports spells
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export { SpellsView };
