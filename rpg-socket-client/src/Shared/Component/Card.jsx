import React from "react";

const Card = ({ children, leftSidetext, rightSideText, isVertical }) => (
  <div className="mx-4 my-2 bg-white rounded-lg shadow-md">
    <div className="p-4">
      <div
        className={`flex items-center justify-between  border-black ${
          isVertical ? "flex-col" : "border-b"
        }`}
      >
        <h2 className="-mt-1 text-lg font-semibold text-gray-900">
          {leftSidetext}
        </h2>
        <small className="text-sm text-gray-700">{rightSideText}</small>
      </div>
    </div>
    {children}
  </div>
);

export { Card };
