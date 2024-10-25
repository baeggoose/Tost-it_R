import React, { useState, KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface LaterItemProps {
  later: { _id: string; title: string };
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const LaterItem: React.FC<LaterItemProps> = ({ later, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(later.title);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    if (editingText.trim() === later.title) {
      setIsEditing(false);
      return;
    }
    onEdit(later._id, editingText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingText(later.title);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveClick();
    }
  };
  return (
    <li className="bg-main_skyblue font-semibold tracking-widest relative w-50 h-32 p-1 shadow shadow-gray-300 whitespace-pre-wrap break-all z-1">
      {isEditing ? (
        <>
          <textarea
            value={editingText}
            maxLength={32}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-24 bg-transparent tracking-widest resize-none whitespace-pre-wrap"
          />
          <button onClick={handleSaveClick}>
            <FontAwesomeIcon
              icon={faCheck}
              className="cursor-pointer hover:opacity-80 absolute right-1.5 bottom-1.5"
              opacity={0.2}
            />
          </button>
          <button onClick={handleCancelClick}>
            <FontAwesomeIcon
              icon={faXmark}
              className="cursor-pointer hover:opacity-80 absolute left-1.5 bottom-1.5"
              opacity={0.2}
            />
          </button>
        </>
      ) : (
        <>
          <p className={`h-24 overflow-y-auto`}>{later.title}</p>

          <button onClick={handleEditClick}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="cursor-pointer hover:opacity-80 absolute right-1.5 bottom-1.5"
              opacity={0.2}
            />
          </button>

          <button onClick={() => onDelete(later._id)}>
            <FontAwesomeIcon
              icon={faTrashCan}
              className="cursor-pointer hover:opacity-80 absolute left-1.5 bottom-1.5"
              opacity={0.2}
            />
          </button>
        </>
      )}
    </li>
  );
};
export default LaterItem;
