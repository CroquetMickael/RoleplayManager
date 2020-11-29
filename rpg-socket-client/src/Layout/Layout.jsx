import React from "react";
import { NavBar } from "./Navbar";

const Layout = ({ props, children, navBarProps }) => (
  <div className="flex flex-col content-start h-full">
    <NavBar {...navBarProps} />
    <div className="w-full h-full">{children}</div>
  </div>
);

export { Layout };
