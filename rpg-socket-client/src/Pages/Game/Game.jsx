import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../Shared/Context/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../Shared/Context/UserContext";
import { RoomInformation } from "./Component/GameView/RoomInformations/RoomInformation";
import { SpellsView } from "./Component/GameView/Spell/SpellsView";
import { useModal } from "../../Shared/Hooks/ModalHooks";
import { useAlert } from "../../Shared/Hooks/AlertHooks";
import { ChangePasswordForm } from "./Component/GameView/RoomInformations/ChangePasswordForm";
import { AlertList } from "./Component/Alerts/AlertList";
import { Card } from "../../Shared/Component/Card";
import { FaPen, FaPlus, FaTimes } from "react-icons/fa";
import { Tooltip } from "../../Shared/Component/Tooltip/Tooltip";
import { AddMonsterForm } from "./Component/GameView/RoomInformations/AddMonsterForm";
import { ModifyInitiativeForm } from "./Component/GameView/RoomInformations/ModifyInitiative";

const Game = () => {
  const { roomName } = useParams();
  const { socket } = useContext(SocketContext);
  const { playerName } = useContext(UserContext);
  const [roomInformation, setRoomInformation] = useState();
  const [initiative, setInitiative] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const { Modal, ShowAndSetModalContent } = useModal();
  const { addNewAlert, alerts, cleanAlertFromArray } = useAlert();

  const navigate = useNavigate();
  useEffect(() => {
    socket.emit("checkPlayer", { roomName, playerName });
    const interval2 = setInterval(() => {
      socket.on("playerNotAllowed", () => {
        navigate("/");
      });
      socket.emit("getRoomInformation", roomName);
      socket.on("roomInformation", (data) => {
        const initiativeArray = [];
        data.players.forEach((player) => {
          initiativeArray.push({
            id: player.id,
            name: player.name,
            initiative: player.initiative,
            isMonster: false,
          });
        });
        data.monsters.forEach((monster) => {
          initiativeArray.push({
            id: monster.id,
            name: monster.name,
            initiative: monster.initiative,
            isMonster: true,
          });
        });
        const sortedInitiative = initiativeArray.sort((a, b) => {
          if (a.initiative < b.initiative) {
            return 1;
          } else if (a.initiative > b.initiative) {
            return -1;
          }
          return 0;
        });
        setInitiative(sortedInitiative);
        setRoomInformation(data);
      });
    }, 1000);
    return () => {
      clearInterval(interval2);
      socket.emit("leaveRoom", { playerName, roomName });
    };
  }, [navigate, playerName, roomName, socket]);

  useEffect(() => {
    const owner = roomInformation?.owner === playerName;
    setIsOwner(owner);
  }, [playerName, roomInformation?.owner]);

  useEffect(() => {
    socket.on("RoundEnded", function () {
      addNewAlert(
        "This is a end of round !",
        `The round is finish ! A new one start !`
      );
    });
    socket.on("PlayerJoined", function (playerName) {
      addNewAlert(
        "Player have joined the game !",
        `${playerName} has joined the game`
      );
    });
    socket.on("roomPasswordChanged", function () {
      addNewAlert("Password Modified", "The room password have been modified");
    });
    socket.on("GMJoined", function () {
      addNewAlert("GM have joined the game !", "The GM has joined the game");
    });
    socket.on("monsterHasBeenAdded", function () {
      addNewAlert("Monster Added", "The monster has been added !");
    });
    socket.on("monsterHasBeenDeleted", function (name) {
      addNewAlert(
        "Monster Deleted", `The monster named: ${name} has been deleted`
      );
    });
  }, [socket]);

  const endOfTurn = () => {
    socket.emit("endOfRound", { playerName, roomName });
  };

  const canModify = (name) => {
    if (name === playerName || isOwner === true) {
      return true;
    }
    return false;
  };

  const changePassword = (password) => {
    socket.emit("modifyRoomPassword", { playerName, roomName, password });
  };

  const modifyInitiative = (isMonster, id, initiative) => {
    if (isMonster) {
      socket.emit("modifyMonsterInitiative", {
        playerName,
        roomName,
        id,
        initiative,
      });
    } else {
      socket.emit("modifyPlayerInitiative", {
        playerName,
        roomName,
        id,
        initiative,
      });
    }
  };

  const addMonster = (monsterName, monsterInitiative) => {
    socket.emit("addMonster", {
      playerName,
      roomName,
      monsterName,
      monsterInitiative,
    });
  };

  return (
    <div className="relative h-full overflow-x-hidden">
      <RoomInformation
        roomName={roomName}
        roomInformation={roomInformation}
        isOwner={isOwner}
        changePassword={() =>
          ShowAndSetModalContent(
            "Change room password",
            <ChangePasswordForm changePassword={changePassword} />
          )
        }
      />
      <div className="py-4">
        <Card
          isVertical={false}
          leftSidetext={"Initiative"}
          rightSideText={
            isOwner ? (
              <div className="mr-8">
                <button
                  className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                  onClick={() =>
                    ShowAndSetModalContent(
                      "Add Monster",
                      <AddMonsterForm addMonster={addMonster} />
                    )
                  }
                >
                  <FaPlus />
                  <Tooltip text="Add monster" />
                </button>
              </div>
            ) : null
          }
        >
          <div className="grid grid-cols-6">
            {initiative.map((initiative) => (
              <Card
                key={initiative.name}
                isVertical={true}
                leftSidetext={
                  <p
                    className={`${
                      initiative.isMonster ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {initiative.name}
                  </p>
                }
                rightSideText={initiative.initiative}
              >
                {isOwner ? (
                  <div className="flex flex-wrap">
                    <button
                      className="flex items-center justify-center p-2 m-2 text-white bg-blue-300 rounded-full hover:bg-blue-500 tooltip"
                      onClick={() =>
                        ShowAndSetModalContent(
                          `Modify initiative of ${initiative.name}`,
                          <ModifyInitiativeForm
                            initialInitiative={initiative}
                            modifyInitiative={modifyInitiative}
                          />
                        )
                      }
                    >
                      <FaPen />
                      <Tooltip text="Modify Initiative" />
                    </button>
                    {initiative.isMonster ? (
                      <button
                        className="flex items-center justify-center p-2 m-2 text-white bg-red-300 rounded-full hover:bg-red-500 tooltip"
                        onClick={() =>
                          ShowAndSetModalContent(
                            "Delete a monster",
                            <>
                              <p>
                                You're about to delete a monster named :{" "}
                                {initiative.name}
                              </p>
                              <button
                                className="flex items-center justify-center w-full h-8 p-2 m-2 text-white bg-red-300 rounded hover:bg-red-500"
                                onClick={() => {
                                  socket.emit("deleteMonster", {
                                    playerName,
                                    roomName,
                                    id: initiative.id,
                                  });
                                }}
                              >
                                Confirm !
                              </button>
                            </>
                          )
                        }
                      >
                        <FaTimes />
                        <Tooltip text="Delete Monster" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </Card>
      </div>
      {roomInformation?.players?.map((player) => (
        <div className="relative" key={player.name}>
          <SpellsView
            key={player.name}
            player={player}
            socket={socket}
            canModify={canModify(player.name)}
            isOwner={isOwner}
            currentPlayerName={playerName}
            roomName={roomName}
            ShowAndSetModalContent={ShowAndSetModalContent}
            ShowAndSetAlertContent={addNewAlert}
          />
        </div>
      ))}
      {isOwner ? (
        <div className="m-4">
          <button
            onClick={() => endOfTurn()}
            className="w-full bg-green-500 rounded hover:bg-green-700"
          >
            End of round
          </button>
        </div>
      ) : null}
      {Modal}
      <AlertList alerts={alerts} cleanAlertFromArray={cleanAlertFromArray} />
    </div>
  );
};

export { Game };
