import React from "react";
import { FaChevronUp } from "react-icons/fa";

const Accordion = ({ title, index, children }) => (
  <div className="w-full overflow-hidden border-t shadow-xs tab">
    <input
      className="absolute opacity-0"
      id={index}
      type="checkbox"
      name="tabs"
    />
    <label
      className="flex justify-between p-5 leading-normal cursor-pointer"
      for={index}
    >
      <p>{title}</p>
      <div class="icon-container p-1">
        <FaChevronUp className="transition-transform duration-75 icon" />
      </div>
    </label>
    <div className="overflow-hidden leading-normal tab-content">
      <div className="p-5">{children}</div>
    </div>
  </div>
);

export { Accordion };
