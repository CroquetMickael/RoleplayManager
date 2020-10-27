import "./Root.css";
import { Route, Routes } from "react-router-dom";
import { Index } from "./Index/index";
import { Game } from "./Game/Game";
const Root = () => (
  <Routes>
    <Route path="/" element={<Index />}></Route>
    <Route path="/game/:roomName" element={<Game />}></Route>
  </Routes>
);

export { Root };
