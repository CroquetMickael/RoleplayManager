import React, { useEffect } from "react";
import { SpellButton } from "./SpellButton";
import { SpellDescription } from "./SpellDescription";
import { AddSpellForm } from "./Forms/AddSpellForm";
import { ImportsSpellsForm } from "./Forms/ImportsSpellsForm";
import { ModifyingSpellForm } from "./Forms/ModifyingSpellForm";
import { FaPlus, FaDownload, FaUpload } from "react-icons/fa";
import { Tooltip } from "../../../../../Shared/Component/Tooltip/Tooltip";
import { Card } from "../../../../../Shared/Component/Card";

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

  const modifySpell = (
    spellName,
    spellCooldown,
    spellCurrentCooldown,
    spellDescription
  ) => {
    socket.emit("modifySpell", {
      playerName,
      roomName,
      spellName,
      spellCooldown,
      spellDescription,
      spellCurrentCooldown,
      isOwner,
    });
  };

  const modifyModal = (spell) => {
    ShowAndSetModalContent(
      "Modify a spell",
      <ModifyingSpellForm modifySpell={modifySpell} spell={spell} />
    );
  };

  const deleteSpell = (spellName) => {
    ShowAndSetModalContent(
      "Delete a spell",
      <>
        <p>You're about to delete a spell named : {spellName}</p>
        <button
          className="flex items-center justify-center w-full h-8 p-2 m-2 text-white bg-red-300 rounded hover:bg-red-500"
          onClick={() => {
            socket.emit("deleteSpell", {
              playerName,
              roomName,
              spellName,
            });
          }}
        >
          Confirm !
        </button>
      </>
    );
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
      socket.on("spellsImported", function () {
        ShowAndSetAlertContent(
          "Spells imported",
          "Your spells have been imported"
        );
      });
      socket.on("spellHasBeenModified", function () {
        ShowAndSetAlertContent(
          "Spell Modified",
          "The spell have been modified"
        );
      });
      socket.on("spellHasBeenDeleted", function () {
        ShowAndSetAlertContent("Spell Deleted", "The spell have been deleted");
      });
    }
  }, [socket]);

  return (
    <Card
      leftSidetext={playerName}
      rightSideText={
        <div className="mr-12">
          {canModify ? (
            <div className="flex w-full">
              <button
                className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                onClick={() =>
                  ShowAndSetModalContent(
                    "Add a spell",
                    <AddSpellForm addSpell={addSpell} />
                  )
                }
              >
                <FaPlus />
                <Tooltip text="Add a spell" />
              </button>

              {spells?.length !== 0 && canModify ? (
                <button className="flex items-center justify-center p-2 m-2 text-center text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip">
                  <a
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(
                      JSON.stringify(spells)
                    )}`}
                    download={`${playerName}_spells.json`}
                  >
                    <FaDownload />
                  </a>
                  <Tooltip text="Export spells" />
                </button>
              ) : null}
              <button
                className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                onClick={() =>
                  ShowAndSetModalContent(
                    "Imports Spells",
                    <ImportsSpellsForm importSpells={importSpells} />
                  )
                }
              >
                <FaUpload />
                <Tooltip text="Import spells" />
              </button>
            </div>
          ) : null}
        </div>
      }
    >
      {spells?.length === 0 ? (
        <div className="w-full text-xl font-bold text-center">No spells !</div>
      ) : null}
      <div className="grid grid-cols-6 gap-4 py-4 mx-2">
        {spells?.map((spell) => (
          <SpellButton
            className="w-full bg-blue-400 rounded hover:bg-blue-700"
            textClassName="text-white"
            isOwner={isOwner}
            spellRight={{
              canModify: canModify,
              canDelete: canModify,
              canUse: canModify && isOwner === false,
            }}
            coolDown={spell.currentCooldown}
            spellClicks={{
              useSpell: () => spellUse(spell.name),
              modifySpell: () => modifyModal(spell),
              deleteSpell: () => deleteSpell(spell.name),
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
        ))}
      </div>
    </Card>
  );
};

export { SpellsView };
