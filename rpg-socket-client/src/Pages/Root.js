import "./Root.css";
import { Link, Route, Routes } from "react-router-dom";
import { Index } from "./Index/Index";
import { Game } from "./Game/Game";
import { Layout } from "../Layout/Layout";
import { Lobby } from "./Lobby/Lobby";
import { FaArrowLeft } from "react-icons/fa";

const LayoutRoute = ({ path, element, navBarProps }) => (
  <Layout navBarProps={navBarProps}>
    <Route path={path} element={element}></Route>
  </Layout>
);
const Root = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <LayoutRoute
      path="/lobby"
      element={<Lobby />}
      navBarProps={{
        leftside: (
          <div className="flex-shrink-0 mx-2 text-black dark:text-white">
            LOGO
          </div>
        ),
      }}
    />
    <LayoutRoute
      path="/game/:roomName"
      element={<Game />}
      navBarProps={{
        leftside: (
          <Link to="/lobby" className="inline-block">
          <button className="flex items-center dark:text-white">
            <FaArrowLeft className="mx-2 text-black dark:text-white" /> Disconnect from the game
          </button>
        </Link>
        ),
      }}
    />
  </Routes>
);

export { Root };
