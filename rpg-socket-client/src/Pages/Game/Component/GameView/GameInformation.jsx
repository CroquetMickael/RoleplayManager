import React from "react";

const GameInformation = (props) => (
  <div className="w-full shadow-xs">
    <div className="text-4xl font-bold text-center">
      <p>{props.roomName}</p>
      <p>{props.roomInformation?.password}</p>
    </div>
  </div>
);

export { GameInformation };
