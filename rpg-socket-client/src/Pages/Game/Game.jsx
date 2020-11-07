import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Shared/Context/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/Context/UserContext";
import { GameInformation } from "./Component/GameView/GameInformation";
import { Accordion } from "../Shared/Component/Accordion/Accordion";
import { SpellsView } from "./Component/GameView/Spell/SpellsView";
import { useModal } from "../Shared/Hooks/ModalHooks";
import { useAlert } from "../Shared/Hooks/AlertHooks";

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
    const isRoomInformationOk = () => {
      if (roomInformation === undefined) {
        return false;
      }
      if (roomInformation.players === undefined) {
        return false;
      }
      if (roomInformation.players.length <= 0) {
        return false;
      }
      return true;
    };
    setTimeout(() => {
      socket.emit("checkPlayer", { roomName, playerName });
    }, 500);
    const interval2 = setInterval(() => {
      socket.on("playerNotAllowed", () => {
        navigate("/");
      });
      socket.emit("getRoomInformation", roomName);
      socket.on("roomInformation", (data) => {
        setRoomInformation(data);
        if (!isRoomInformationOk) {
          navigate("/");
        }
      });
    }, 1000);
    return () => {
      clearInterval(interval2);
      socket.emit("leaveRoom", { playerName, roomName });
    };
  }, [playerName, roomName, socket]);

  useEffect(() => {
    const owner = roomInformation?.owner === playerName;
    setIsOwner(owner);
  });

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
  });

  const endOfTurn = () => {
    socket.emit("endOfRound", { playerName, roomName });
  };

  return (
    <div className="relative h-full overflow-x-hidden">
      <GameInformation roomName={roomName} roomInformation={roomInformation} />
      <div className="grid grid-cols-2">
        <div>
          {roomInformation?.players?.map((player, index) => (
            <Accordion key={player.name} title={player.name} index={index}>
              {player.name === playerName || isOwner ? (
                <SpellsView
                  spells={player.spells}
                  socket={socket}
                  canModify={true}
                  isOwner={isOwner}
                  playerName={player.name}
                  currentPlayerName={playerName}
                  roomName={roomName}
                  ShowAndSetAlertContent={ShowAndSetAlertContent}
                  ShowAndSetModalContent={ShowAndSetModalContent}
                />
              ) : (
                <SpellsView
                  spells={player.spells}
                  canModify={false}
                  ShowAndSetAlertContent={ShowAndSetAlertContent}
                  ShowAndSetModalContent={ShowAndSetModalContent}
                />
              )}
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
