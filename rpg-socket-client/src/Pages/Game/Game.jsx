import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Shared/Context/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/Context/UserContext";
const Game = () => {
  const { roomName } = useParams();
  const { socket } = useContext(SocketContext);
  const { playerName } = useContext(UserContext);
  const [roomInformation, setRoomInformation] = useState();
  const navigate = useNavigate();
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

  useEffect(() => {
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
      socket.emit("leaveRoom", { playerName, roomName });
      clearInterval(interval2);
    };
  }, []);
  return (
    <div>
      Game name: {roomName}
      <br />
      players :{" "}
      {roomInformation?.players?.map((player, index) => (
        <span key={player}>{player.name} </span>
      ))}
      room password : {roomInformation?.password}
    </div>
  );
};

export { Game };
