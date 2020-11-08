import "./Root.css";
import { Route, Routes } from "react-router-dom";
import { Index } from "./Index/Index";
import { Game } from "./Game/Game";
import { Layout } from "../Layout/Layout";
import { Lobby } from "./Lobby/Lobby";
const LayoutRoute = ({ path, element }) => (
  <Layout>
    <Route path={path} element={element}></Route>
  </Layout>
);
const Root = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <LayoutRoute path="/lobby" element={<Lobby />} />
    <Route path="/game/:roomName" element={<Game />} />
  </Routes>
);

export { Root };
