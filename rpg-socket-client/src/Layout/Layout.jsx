import React from "react";

const Layout = ({ props, children }) => (
  <div className="flex h-full">
    <div
      className="m-2 w-full
    "
    >
      {children}
    </div>
  </div>
);

export { Layout };
