"use client";

import Portal from "./portal";
import { useState } from "react";
import axios from "axios";

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

  const [note, setNote] = useState<string>("");

  const handleNoteChange = (event: any) => {
    setNote(event.target.value);
  };

  const postNote = async () => {
    try {
      console.log("This is a note", note);
      const response = await axios.patch(`http://localhost:3001/notes`, {
        notes: note,
      });
      console.log("Server response:", response);
    } catch (error) {
      console.error("Error during request:", error);
    }
  };

  console.log("This is the note", note);
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
                onClick={() => {
                  onClose();
                  postNote();
                }}
                className="  bg-blue text-white rounded-md px-3"
              >
                Save
              </button>
            </div>
          </div>
          <div className="pl-3 mr-3 ">
            <input
              className="pl-1 w-full h-8"
              type="text"
              value={note}
              onChange={handleNoteChange}
              placeholder="Write..."
            />
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
