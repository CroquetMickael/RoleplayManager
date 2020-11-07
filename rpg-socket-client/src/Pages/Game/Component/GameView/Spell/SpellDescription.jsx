import React from "react";

const SpellDescription = ({ description, cooldown }) => (
  <div className="p-4">
    <div className="flex items-center justify-between">
      <h2 className="-mt-1 text-lg font-semibold text-gray-900">
        Description {" "}
      </h2>
      <small className="text-sm text-gray-700">Cooldown: {cooldown}</small>
    </div>
    <div>{description}</div>
  </div>
);

export { SpellDescription };
