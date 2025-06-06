import React from "react";

const ModalNotification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  if (!message) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose} // закрити по кліку на фон
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // щоб не закривалось при кліку на вікно
      >
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Закрити
        </button>
      </div>
    </div>
  );
};

export default ModalNotification;
