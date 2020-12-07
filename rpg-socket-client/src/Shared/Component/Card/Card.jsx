import React from "react";

const Card = ({ children, leftSidetext, rightSideText, isVertical }) => (
  <div className="mx-4 my-2 text-black bg-white rounded-lg shadow-md dark:bg-gray-700 dark:text-white">
    <div className="p-4">
      <div
        className={`flex items-center justify-between  border-black ${
          isVertical ? "flex-col" : "border-b"
        }`}
      >
        <h2 className="-mt-1 text-lg font-semibold text-gray-900 dark:text-white">
          {leftSidetext}
        </h2>
        <small className="text-sm text-gray-900 dark:text-white">{rightSideText}</small>
      </div>
    </div>
    {children}
  </div>
);

export { Card };
