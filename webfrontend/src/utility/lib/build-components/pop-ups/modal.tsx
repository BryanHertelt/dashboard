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
        <div className="bg-white h-28 rounded-md shadow-lg w-1/2">
          <div className="flex flex-row justify-around pt-3 pb-3">
            <h2 className="text-lg font-normal pl-3  w-1/2 h-1/2">
              {" "}
              {title} Notes
            </h2>
            <div className="flex justify-end pr-3 w-1/2 rounded">
              <button
                onClick={onClose}
                className="  bg-blue text-white rounded-md px-3"
              >
                Save
              </button>
            </div>
          </div>
          <div className="pl-3">
            <input className="pl-1" placeholder="Write..." />
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
