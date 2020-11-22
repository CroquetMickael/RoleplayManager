import React, { useState } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = React.createContext(null);

const SocketProvider = (props) => {
  const [socket] = useState(socketIOClient(process.env.REACT_APP_SOCKETENDPOINT));
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
