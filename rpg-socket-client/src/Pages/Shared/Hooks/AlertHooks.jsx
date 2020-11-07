import { useState } from "react";

export const useAlert = () => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [isAlertOpen, setAlertIsOpen] = useState(false);

  const showAlert = () => {
    setAlertIsOpen(true);
    setTimeout(() => {
      setAlertIsOpen(false);
    }, 3000);
  };
  function ShowAndSetAlertContent(title, message) {
    setTitle(title);
    setMessage(message);
    showAlert();
  }

  const Alert = (
    <div
      className={`absolute bottom-0 mx-auto my-4 md:top-0 md:right-0 md:m-4 transition-all duration-200 ease-in-out transform ${
        isAlertOpen ? "-translate-x-1" : "translate-x-full"
      }`}
    >
      <div className="h-24 mx-8 bg-white rounded shadow-lg">
        <div className="flex justify-between">
          <div className="p-4 text-lg font-bold">{title}</div>
          <div
            className="p-4 cursor-pointer"
            onClick={() => setAlertIsOpen(false)}
          >
            X
          </div>
        </div>
        <div className="px-4">{message}</div>
      </div>
    </div>
  );

  return { Alert, ShowAndSetAlertContent };
};
