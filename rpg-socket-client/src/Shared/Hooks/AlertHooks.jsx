import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  function addNewAlert(title, message) {
    alerts.push({ id: uuidv4(), title, message });
    setAlerts(alerts);
  }

  function cleanAlertFromArray(id) {
    var array = alerts;
    const elemIndex = alerts.findIndex((alert) => alert.id === id);
    array.splice(elemIndex, 1);
    setAlerts(array);
  }

  return { alerts, addNewAlert, cleanAlertFromArray };
};
