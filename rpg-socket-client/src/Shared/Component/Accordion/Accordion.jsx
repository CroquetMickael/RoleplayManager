import React from "react";

const Accordion = ({ title, index, children }) => (
  <div className="w-full overflow-hidden border-t shadow-xs tab">
    <input
      className="absolute opacity-0"
      id={index}
      type="checkbox"
      name="tabs"
    />
    <label className="block p-5 leading-normal cursor-pointer" for={index}>
      {title}
    </label>
    <div className="overflow-hidden leading-normal tab-content">
      <div className="p-5">{children}</div>
    </div>
  </div>
);

export { Accordion };
