import React from "react";
import { usePanelState } from "@bumaga/tabs";

const TabPanel = ({ children }) => {
  const isActive = usePanelState();

  return isActive ? <>{children}</> : null;
};

export { TabPanel };
