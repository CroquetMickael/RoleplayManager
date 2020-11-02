import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Shared/Context/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/Context/UserContext";
import { PersonView } from "./Component/PersonView/PersonView";
import { GameInformation } from "./Component/GameInformation/GameInformation";

const Game = () => {
  const { roomName } = useParams();
  const { socket } = useContext(SocketContext);
  const { playerName } = useContext(UserContext);
  const [roomInformation, setRoomInformation] = useState();
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
    document.addEventListener("beforeunload", () =>
      socket.emit("leaveRoom", { playerName, roomName })
    );
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
  return (
    <div>
      <GameInformation roomName={roomName} roomInformation={roomInformation} />
      <PersonView roomInformation={roomInformation} playerName={playerName} />
    </div>
  );
};

export { Game };
