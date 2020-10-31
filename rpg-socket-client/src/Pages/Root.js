import "./Root.css";
import { Route, Routes } from "react-router-dom";
import { Index } from "./Index/index";
import { Game } from "./Game/Game";
import { Layout } from "../Layout/Layout";
const LayoutRoute = ({ path, element }) => (
  <Layout>
    <Route path={path} element={element}></Route>
  </Layout>
);
const Root = () => (
  <Routes>
    <LayoutRoute path="/" element={<Index />} />
    <Route path="/game/:roomName" element={<Game />} />
  </Routes>
);

export { Root };
