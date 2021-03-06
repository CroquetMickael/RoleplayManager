import React, { useContext, useEffect } from "react";
import { SpellButton } from "./SpellButton";
import { SpellDescription } from "./SpellDescription";
import { AddSpellForm } from "./Forms/AddSpellForm";
import { ImportsSpellsForm } from "./Forms/ImportsSpellsForm";
import { ModifyingSpellForm } from "./Forms/ModifyingSpellForm";
import { FaPlus, FaDownload, FaUpload } from "react-icons/fa";
import { Tooltip } from "../../../../../Shared/Component/Tooltip/Tooltip";
import { SocketContext } from "../../../../../Shared/Context/SocketContext";

const SpellsView = ({
  entity,
  canModify,
  currentPlayerName,
  roomId,
  isOwner,
  isMonster,
  ShowAndSetAlertContent,
  modal,
}) => {
  const { socket } = useContext(SocketContext);
  const addSpell = (spellName, spellCooldown, spellDescription) => {
    if (!isMonster) {
      socket.emit("addSpellToPlayer", {
        entityId: entity.id,
        roomId,
        spellName,
        spellCooldown,
        spellDescription,
      });
    } else {
      socket.emit("addSpellToMonster", {
        entityId: entity.id,
        roomId,
        spellName,
        spellCooldown,
        spellDescription,
      });
    }
    modal.setIsModalOpen(false);
  };

  const modifySpell = (
    spellId,
    spellName,
    spellCooldown,
    spellCurrentCooldown,
    spellDescription
  ) => {
    socket.emit("modifySpell", {
      spellId,
      roomId,
      spellName,
      spellCooldown,
      spellDescription,
      spellCurrentCooldown,
      isOwner,
    });
    modal.setIsModalOpen(false);
  };

  const modifyModal = (spell) => {
    modal.ShowAndSetModalContent(
      "Modify a spell",
      <ModifyingSpellForm modifySpell={modifySpell} spell={spell} />
    );
  };

  const deleteSpell = (spellName, spellId) => {
    modal.ShowAndSetModalContent(
      "Delete a spell",
      <>
        <p>You're about to delete a spell named : {spellName}</p>
        <button
          className="flex items-center justify-center w-full h-8 p-2 m-2 text-white bg-red-300 rounded hover:bg-red-500"
          onClick={() => {
            socket.emit("deleteSpell", {
              roomId,
              spellId,
            });
            modal.setIsModalOpen(false);
          }}
        >
          Confirm !
        </button>
      </>
    );
  };

  const importSpells = (spells) => {
    socket.emit("importSpells", {
      playerId: entity.id,
      roomId,
      spells,
    });
  };

  const convertSpellWithoutIds = (spells) => {
    const spellToReturn = spells.map((spell) => {
      return {
        id: spell.id,
        name: spell.name,
        description: spell.description,
        currentCooldown: spell.currentCooldown,
        defaultCooldown: spell.defaultCooldown,
        playerId: spell.playerId,
      };
    });
    return spellToReturn;
  };

  const spellUse = (spellId) => {
    if (
      currentPlayerName === entity.name ||
      (isOwner === true && isMonster === true)
    ) {
      socket.emit("useSpell", { roomId, spellId, entityName: entity.name });
    }
  };

  const showSpellDescription = (spellName, spellDescription, spellCooldown) => {
    modal.ShowAndSetModalContent(
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
    <>
      <div className="mx-4 my-2 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <div className="p-4">
          <div className="flex items-center justify-between border-black">
            <h2
              className={`text-lg font-semibold text-gray-900 p-2 rounded-lg ${
                entity.isConnected ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              {entity.name}
            </h2>
            <h3 className="ml-4 text-xl font-medium text-black dark:text-white">
              Spell
            </h3>
            <div className="mr-12">
              {canModify ? (
                <div className="flex w-full space-x-4">
                  <button
                    className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                    onClick={() =>
                      modal.ShowAndSetModalContent(
                        "Add a spell",
                        <AddSpellForm addSpell={addSpell} />
                      )
                    }
                  >
                    <FaPlus />
                    <Tooltip text="Add a spell" />
                  </button>
                  {entity.spells?.length !== 0 && canModify ? (
                    <button className="flex items-center justify-center p-2 m-2 text-center text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip">
                      <a
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                          JSON.stringify(convertSpellWithoutIds(entity.spells))
                        )}`}
                        download={`${entity.name}_spells.json`}
                      >
                        <FaDownload />
                      </a>
                      <Tooltip text="Export spells" />
                    </button>
                  ) : null}
                  <button
                    className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                    onClick={() =>
                      modal.ShowAndSetModalContent(
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
          </div>
        </div>
        <hr className="mx-4 mt-1" />
        {entity.spells?.length === 0 ? (
          <div className="w-full text-xl font-bold text-center text-black dark:text-white">
            No spells !
          </div>
        ) : null}
        <div className="grid grid-cols-3 gap-2 p-2 mx-2 lg:grid-cols-6 md:gap-4">
          {entity.spells?.map((spell) => (
            <div className="inline-block w-full" key={spell.name}>
              <SpellButton
                className="w-full bg-blue-400 rounded hover:bg-blue-700"
                textClassName="text-white"
                isOwner={isOwner}
                spellRight={{
                  canModify: canModify,
                  canDelete: canModify,
                  canUse:
                    (canModify && isOwner === false) ||
                    (isOwner === true && isMonster === true),
                }}
                coolDown={spell.currentCooldown}
                spellClicks={{
                  useSpell: () => spellUse(spell.id),
                  modifySpell: () => modifyModal(spell),
                  deleteSpell: () => deleteSpell(spell.name, spell.id),
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { SpellsView };
