import Portal from "./note-pop-up";

const Modal = ({
  isOpen,
  onClose,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string | undefined;
}) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold">Modal Title</h2>
          <p>Content inside the modal</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-black rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
