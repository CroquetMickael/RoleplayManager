import React from "react";
import ReactDOM from "react-dom";
import { Root } from "./Pages/Root";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./Shared/Context/SocketContext";
import { UserProvider } from "./Shared/Context/UserContext";
import { DarkModeProvider } from "./Shared/Context/DarkMode";
ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <UserProvider>
        <DarkModeProvider>
          <BrowserRouter>
            <Root />
          </BrowserRouter>
        </DarkModeProvider>
      </UserProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
