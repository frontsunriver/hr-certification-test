import './Modal.css';
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50  modal-animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0f112d] text-white p-6 rounded shadow-lg w-full max-w-md relative modal-animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-white bg-transparent
"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
