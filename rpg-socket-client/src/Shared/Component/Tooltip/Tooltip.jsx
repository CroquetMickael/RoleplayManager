import React from "react";

const Tooltip = ({ text }) => (
  <span className="p-2 mt-10 ml-12 bg-blue-200 rounded tooltip-text">
    {text}
  </span>
);

export { Tooltip };
