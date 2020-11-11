import React, { useEffect } from "react";

const Alert = ({ title, message, id, cleanArray }) => {
  useEffect(() => {
    setTimeout(() => {
      cleanArray(id);
    }, 5000);
  }, []);
  
  return (
    <div className="h-24 mx-8 bg-white rounded shadow-lg">
      <div className="flex justify-between">
        <div className="p-4 text-lg font-bold">{title}</div>
        <div className="p-4 cursor-pointer" onClick={() => cleanArray(id)}>
          X
        </div>
      </div>
      <div className="px-4">{message}</div>
    </div>
  );
};

export { Alert };
