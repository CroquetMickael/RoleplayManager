import React, { useState } from "react";
import socketIOClient from "socket.io-client";

let ENDPOINT = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  ENDPOINT = "http://127.0.0.1:4001";
} else {
  ENDPOINT = "https://roleplay-manager-server.herokuapp.com";
 
}
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
