import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Root } from "./Pages/Root";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./Shared/Context/SocketContext";
import { UserProvider } from "./Shared/Context/UserContext";
ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <SocketProvider>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
