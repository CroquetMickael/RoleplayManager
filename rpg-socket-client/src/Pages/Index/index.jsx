import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../Shared/SocketContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/UserContext";
import { CardGame } from "./Components/Card";
const Index = () => {
  const [rooms, setRooms] = useState();
  const [roomName, setRoomName] = useState("");
  const [playersName, setPlayersName] = useState("");
  const [maxPlayer, setMaxPlayer] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const navigation = useNavigate();
  const { socket } = useContext(SocketContext);
  const {
    playerName,
    setPlayerName,
    roomPassword,
    setRoomPassword,
  } = useContext(UserContext);
  useEffect(() => {
    const interval = setInterval(() => {
      if (socket != null) {
        socket.emit("getRooms");
        socket.emit("getPlayersName");
        socket.on("playersName", (data) => {

        })
        socket.on("rooms", (data) => {
          setRooms(data);
        });
        console.log(rooms);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <>
      <div className="flex flex-wrap">
        {rooms !== undefined
          ? Object.keys(rooms).map((roomName) => (
              <CardGame
                players={rooms[roomName].players}
                roomName={roomName}
                playersNumber={rooms[roomName].players.length}
                roomMaxPlayer={4}
              />
            ))
          : null}
      </div>
      <div className="py-4">
        <input
          placeholder="Password of the room"
          value={roomPassword}
          onChange={(event) => setRoomPassword(event.target.value)}
        ></input>
        <input
          placeholder="Name of the room"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
        ></input>
        <input
          placeholder="Name of the player"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
        ></input>
        <button
          onClick={() => {
            socket.emit("createRoom", { playerName, roomName });
            navigation(`/game/${roomName}`);
          }}
        >
          Create a room
        </button>
      </div>
    </>
  );
};

export { Index };
