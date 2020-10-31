import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Shared/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/UserContext";
const Game = () => {
  const { roomName } = useParams();
  const { socket } = useContext(SocketContext);
  const { playerName, roomPassword } = useContext(UserContext);
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
    socket.emit("joinRoom", { playerName, roomName, roomPassword });
    const interval2 = setInterval(() => {
      socket.on("wrongPassword", () => {
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
