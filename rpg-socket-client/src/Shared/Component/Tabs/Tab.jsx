import React, { useState } from "react";
import { useTabState, usePanelState } from "@bumaga/tabs";

const Tab = ({ children }) => {
  const { onClick, isActive } = useTabState();
  return (
    <button
      className={`p-2 text-black dark:text-white w-1/2 ${
        isActive ? "border-b-2 border-blue-400" : "border-b-2 border-gray-200"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Tab };
