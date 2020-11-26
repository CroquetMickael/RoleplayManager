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
import { ModifyInitiativeForm } from "./Component/GameView/RoomInformations/ModifyInitiative";
import { Initiative } from "./Component/GameView/Initiative";
import { GameNavBar } from "./Component/GameView/GameNavBar";

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
    socket.emit("playerCheckConnection", { roomName, playerName });
    socket.on("playerAllowedOrReconnected", function () {
      socket.emit("getGameInformation", roomName);
    });

    socket.on("playerNotAllowed", function () {
      navigate("/lobby");
    });
    socket.on("updateGameInformation", (data) => {
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
      const owner = data?.owner === playerName;
      setIsOwner(owner);
      setInitiative(sortedInitiative);
      setRoomInformation(data);
    });
    return () => {
      socket.emit("leaveRoom", { playerName, roomName });
    };
  }, [navigate, playerName, roomName, socket]);

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
        "Monster Deleted",
        `The monster named: ${name} has been deleted`
      );
    });
  }, []);

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

  const modifyInitiative = (isMonster, id, name) => {
    function emitModificationOfInitiative(initiative) {
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
    }
    ShowAndSetModalContent(
      `Modify initiative of ${name}`,
      <ModifyInitiativeForm
        initialInitiative={initiative}
        modifyInitiative={emitModificationOfInitiative}
      />
    );
  };

  function deleteMonster(id, name) {
    ShowAndSetModalContent(
      "Delete a monster",
      <>
        <p>You're about to delete a monster named : {name}</p>
        <button
          className="flex items-center justify-center w-full h-8 p-2 m-2 text-white bg-red-300 rounded hover:bg-red-500"
          onClick={() => {
            socket.emit("deleteMonster", {
              playerName,
              roomName,
              id: id,
            });
          }}
        >
          Confirm !
        </button>
      </>
    );
  }

  const addMonster = (monsterName, monsterInitiative) => {
    socket.emit("addMonster", {
      playerName,
      roomName,
      monsterName,
      monsterInitiative,
    });
  };

  return (
    <div className="relative">
      <div id="game" className="h-full transition-all duration-300 ease-in-out">
        <GameNavBar />
        <div className="flex flex-col items-stretch flex-1 h-full bg-white justify-self-stretch md:flex-row dark:bg-gray-900 dark:text-white">
          <RoomInformation
            roomName={roomName}
            isOwner={isOwner}
            password={roomInformation?.password}
            addMonster={addMonster}
            changePassword={() =>
              ShowAndSetModalContent(
                "Change room password",
                <ChangePasswordForm changePassword={changePassword} />
              )
            }
          />
          <div className="w-full h-screen p-2">
            <p className="text-3xl text-center text-black dark:text-white">
              Alert system is not available right now
            </p>
            <Initiative
              initiative={initiative}
              isOwner={isOwner}
              playerName={playerName}
              roomName={roomName}
              modifyInitiative={modifyInitiative}
              deleteMonster={deleteMonster}
              addMonster={addMonster}
            />
            <div class="mt-4">
              <h3 class="md:text-3xl text-2xl ml-4 text-black dark:text-white">
                Players
              </h3>
              {roomInformation?.players?.map((player) => (
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
              ))}
            </div>
            {isOwner ? (
              <div className="m-4">
                <button
                  onClick={() => endOfTurn()}
                  className="w-full text-black bg-green-500 rounded hover:bg-green-700 dark:text-white"
                >
                  End of round
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {Modal}
      {false ? (
        <AlertList alerts={alerts} cleanAlertFromArray={cleanAlertFromArray} />
      ) : null}
    </div>
  );
};

export { Game };
