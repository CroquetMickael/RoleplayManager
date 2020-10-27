import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../Shared/SocketContext";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Shared/UserContext";
const Index = () => {
  const [rooms, setRooms] = useState();
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
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
        console.log(rooms);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <div>
      {rooms !== undefined
        ? Object.keys(rooms).map((roomName) => (
            <div key={roomName}>
              {roomName}
              players :{" "}
              {rooms[roomName].players.map((player) => (
                <span key={player.name}>{player.name} </span>
              ))}
              <div>
                <input
                  placeholder="Room password"
                  onChange={(event) => {
                    setPassword("");
                    setPassword(event.target.value);
                  }}
                ></input>
                <Link to={`/game/${roomName}`}>
                  <button>Join game</button>
                </Link>
              </div>
            </div>
          ))
        : null}
      <div>
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
    </div>
  );
};

export { Index };
