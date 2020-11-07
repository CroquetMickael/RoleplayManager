import React, { useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://roleplay-manager-client.herokuapp.com";

const SocketContext = React.createContext(null);

const SocketProvider = (props) => {
  const [socket] = useState(socketIOClient(ENDPOINT));
  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
