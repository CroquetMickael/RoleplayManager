import React from "react";

const Button = (props) => (
  <button
    className="w-full p-1 my-1 text-white bg-blue-400 rounded-sm hover:bg-blue-600"
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

export { Button };
