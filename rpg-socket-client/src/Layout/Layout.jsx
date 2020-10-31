import React from "react";

const Layout = ({ props, children }) => (
  <div className="flex bg-white">
    <div className="w-1/5"></div>
    <div className="w-3/5">{children}</div>
    <div className="w-1/5"></div>
  </div>
);

export { Layout };
