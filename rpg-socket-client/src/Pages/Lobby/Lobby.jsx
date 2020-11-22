import React, { useEffect, useState, useContext, useCallback } from "react";
import { SocketContext } from "../../Shared/Context/SocketContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Shared/Context/UserContext";
import { useModal } from "../../Shared/Hooks/ModalHooks";
import { CreateRoomForm } from "./Components/CreateRoomForm";
import { JoinRoom } from "./Components/JoinRoom";
import { PlayerNameForm } from "./Components/PlayerNameForm";
import { Card } from "../../Shared/Component/Card";
import { Button } from "../../Shared/Component/Button/Button";

const Lobby = () => {
  const [rooms, setRooms] = useState();
  const navigation = useNavigate();
  const { socket } = useContext(SocketContext);
  const { playerName, setPlayerName, checkPlayerNameExists } = useContext(
    UserContext
  );
  const { setIsModalOpen, Modal, ShowAndSetModalContent } = useModal();

  const addOrModifyPlayerName = useCallback(
    (type) => {
      ShowAndSetModalContent(
        `${type} your player Name`,
        <PlayerNameForm
          setIsModalOpen={setIsModalOpen}
          setPlayerName={setPlayerName}
          playerName={playerName}
        />
      );
    },
    [playerName, setIsModalOpen, setPlayerName]
  );

  useEffect(() => {
    if (!checkPlayerNameExists()) {
      addOrModifyPlayerName("Insert");
    }
    const interval = setInterval(() => {
        socket.emit("getRooms");
        socket.on("rooms", (data) => {
          console.log(data)
          setRooms(data);
        });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [addOrModifyPlayerName, checkPlayerNameExists, socket]);

  const joinRoom = (roomName, roomPassword) => {
    socket.emit("joinRoom", { playerName, roomName, roomPassword });
    socket.on("roomJoined", () => {
      navigation(`/game/${roomName}`);
    });
  };

  const createRoom = (roomName, maxPlayer) => {
    socket.emit("createRoom", { playerName, roomName, maxPlayer });
    socket.on("roomCreated", () => {
      navigation(`/game/${roomName}`);
    });
  };

  return (
    <>
      <p className="text-3xl text-red-500">
        L'interface est susceptible de changer !
      </p>
      <div className="grid grid-cols-3 gap-4 xl:grid-cols-6 auto-rows-max">
        {rooms !== undefined
          ? rooms.map((room) => (
              <Card
                key={room.id}
                leftSidetext={room.name}
                rightSideText={
                  <span>
                    {room.players?.length} / {room.maxPlayer}
                  </span>
                }
                isVertical={true}
              >
                <div className="mx-2">
                  {room.maxPlayer === room.players?.length &&
                  room.isOwnerConnected ? (
                    <Button>Room is full</Button>
                  ) : (
                    <Button
                      onClick={() =>
                        ShowAndSetModalContent(
                          `Joining : ${room.name}`,
                          <JoinRoom
                            key={room.name}
                            joinRoom={joinRoom}
                            roomName={room.name}
                          />
                        )
                      }
                    >
                      Join game
                    </Button>
                  )}
                </div>
              </Card>
            ))
          : null}
      </div>
      {rooms !== undefined && Object.keys(rooms).length === 0 ? (
        <h1 className="p-2 text-2xl font-bold text-center">
          Currently no room !
        </h1>
      ) : null}
      <div className="w-full py-4">
        <button
          className="flex items-center justify-center w-full h-8 p-2 my-2 text-white bg-blue-300 rounded hover:bg-blue-500"
          onClick={() =>
            ShowAndSetModalContent(
              "Create a room",
              <CreateRoomForm createRoom={createRoom} />
            )
          }
        >
          Create a room
        </button>
        <button
          className="flex items-center justify-center w-full h-8 p-2 my-2 text-white bg-blue-300 rounded hover:bg-blue-500"
          onClick={() => addOrModifyPlayerName("Modify")}
        >
          Modify player name
        </button>
        {Modal}
      </div>
    </>
  );
};

export { Lobby };
