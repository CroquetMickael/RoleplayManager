import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = React.createContext(null);

const SocketProvider = (props) => {
  const url =
    process.env.NODE_ENV === "test" ? "" : process.env.REACT_APP_SOCKETENDPOINT;
  const [socket] = useState(socketIOClient(url));
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
