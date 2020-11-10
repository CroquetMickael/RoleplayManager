import React from "react";
import { FaPen } from "react-icons/fa";

const RoomInformation = (props) => (
  <div className="w-full shadow-xs">
    <div className="text-4xl font-bold text-center">
      <p>{props.roomName}</p>
      <p>
        {props.roomInformation?.password}
        {props.isOwner ? (
          <button className="px-2 text-xl" onClick={props.changePassword}>
            <FaPen />
          </button>
        ) : null}
      </p>
    </div>
  </div>
);

export { RoomInformation };
