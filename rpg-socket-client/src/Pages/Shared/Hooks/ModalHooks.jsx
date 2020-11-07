import { useState } from "react";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const showModal = () => setIsModalOpen(!isModalOpen);

  function ShowAndSetModalContent(title, children) {
    setIsModalOpen(true);
    setModalTitle(title);
    setModalContent(children);
  }

  const Modal = (
    <div
      className={`fixed top-0 left-0 flex items-center justify-center w-full h-full modal ${
        isModalOpen ? "" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
        onClick={() => showModal()}
      ></div>
      <div className="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
        <div className="px-6 py-4 text-left modal-content">
          <div className="flex items-center justify-between pb-3">
            <p className="text-2xl font-bold">{modalTitle}</p>
            <div
              className="z-50 cursor-pointer modal-close"
              onClick={() => showModal()}
            >
              <svg
                className="text-black fill-current hover:text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <hr className="mb-1 border border-blue-400" />
          {modalContent}
        </div>
      </div>
    </div>
  );

  return { showModal, ShowAndSetModalContent, Modal };
};
