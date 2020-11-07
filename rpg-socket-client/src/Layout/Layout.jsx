import React from "react";

const Layout = ({ props, children }) => (
  <div className="flex h-full">
    <div
      className="w-full m-2 "
    >
      {children}
    </div>
  </div>
);

export { Layout };
