import React, { useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

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
