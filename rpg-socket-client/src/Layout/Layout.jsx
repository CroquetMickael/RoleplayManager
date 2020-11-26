import React from "react";

const Layout = ({ props, children }) => (
  <div className="flex h-full">
    <div
      className="w-full"
    >
      {children}
    </div>
  </div>
);

export { Layout };
