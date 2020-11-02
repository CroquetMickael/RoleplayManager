import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../Shared/Context/SocketContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/Context/UserContext";
import { CardGame } from "./Components/Card";
const Index = () => {
  const [rooms, setRooms] = useState();
  const [roomName, setRoomName] = useState("");
  const [maxPlayer, setMaxPlayer] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const navigation = useNavigate();
  const { socket } = useContext(SocketContext);
  const { playerName, setPlayerName } = useContext(UserContext);
  useEffect(() => {
    const interval = setInterval(() => {
      if (socket != null) {
        socket.emit("getRooms");
        socket.on("rooms", (data) => {
          setRooms(data);
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  const joinRoom = (roomName) => {
    socket.emit("joinRoom", { playerName, roomName, roomPassword });
    socket.on("roomJoined", () => {
      navigation(`/game/${roomName}`);
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 xl:grid-cols-6 auto-rows-max">
        {rooms !== undefined
          ? Object.keys(rooms).map((roomName) => (
              <CardGame
                key={roomName}
                players={rooms[roomName].players}
                roomName={roomName}
                playersNumber={rooms[roomName].players.length}
                maxPlayer={rooms[roomName].maxPlayer}
                onClick={() => joinRoom(roomName)}
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
          placeholder="Number max of player for room"
          value={maxPlayer}
          onChange={(event) => setMaxPlayer(event.target.value)}
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
            socket.emit("createRoom", { playerName, roomName, maxPlayer });
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
