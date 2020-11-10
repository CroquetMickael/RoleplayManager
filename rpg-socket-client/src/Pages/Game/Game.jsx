import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../Shared/Context/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../Shared/Context/UserContext";
import { RoomInformation } from "./Component/GameView/RoomInformations/RoomInformation";
import { Accordion } from "../../Shared/Component/Accordion/Accordion";
import { SpellsView } from "./Component/GameView/Spell/SpellsView";
import { useModal } from "../../Shared/Hooks/ModalHooks";
import { useAlert } from "../../Shared/Hooks/AlertHooks";
import { ChangePasswordForm } from "./Component/GameView/RoomInformations/ChangePasswordForm";

const Game = () => {
  const { roomName } = useParams();
  const { socket } = useContext(SocketContext);
  const { playerName } = useContext(UserContext);
  const [roomInformation, setRoomInformation] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const { Modal, ShowAndSetModalContent } = useModal();
  const { Alert, ShowAndSetAlertContent } = useAlert();

  const navigate = useNavigate();
  useEffect(() => {
    socket.emit("checkPlayer", { roomName, playerName });
    const interval2 = setInterval(() => {
      socket.on("playerNotAllowed", () => {
        navigate("/");
      });
      socket.emit("getRoomInformation", roomName);
      socket.on("roomInformation", (data) => {
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
      ShowAndSetAlertContent(
        "This is a end of round !",
        `The round is finish ! A new one start !`
      );
    });
    socket.on("PlayerJoined", function (playerName) {
      ShowAndSetAlertContent(
        "Player have joined the game !",
        `${playerName} has joined the game`
      );
    });
    socket.on("roomPasswordChanged", function () {
      ShowAndSetAlertContent(
        "Password Modified",
        "The room password have been modified"
      );
    });
    socket.on("GMJoined", function () {
      ShowAndSetAlertContent(
        "GM have joined the game !",
        "The GM has joined the game"
      );
    });
  }, [ShowAndSetAlertContent, socket]);

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
      <div className="grid grid-cols-2">
        <div>
          {roomInformation?.players?.map((player, index) => (
            <Accordion key={player.name} title={player.name} index={index}>
              <SpellsView
                spells={player.spells}
                socket={socket}
                canModify={canModify(player.name)}
                isOwner={isOwner}
                playerName={player.name}
                currentPlayerName={playerName}
                roomName={roomName}
                ShowAndSetAlertContent={ShowAndSetAlertContent}
                ShowAndSetModalContent={ShowAndSetModalContent}
              />
            </Accordion>
          ))}
        </div>
        <div className="text-center">
          Va contenir l'initiative et les actions émises !
        </div>
      </div>
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
      {Alert}
    </div>
  );
};

export { Game };
