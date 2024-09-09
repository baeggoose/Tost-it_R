import {
  faCheck,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, KeyboardEvent } from "react";

interface TodoItemProps {
  todo: { _id: string; title: string; category: string };
  onSaveEditTodo: (id: string, newTitle: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onSaveEditTodo,
  onDeleteTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.title);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "morning":
        return "bg-red-400";
      case "lunch":
        return "bg-yellow-300";
      case "dinner":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editingText.trim() === todo.title) {
      setIsEditing(false);
      return;
    }
    onSaveEditTodo(todo._id, editingText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingText(todo.title);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <li
      className={`font-semibold tracking-widest relative w-50 h-32 p-1 shadow shadow-black break-all z-10 ${getCategoryColor(
        todo.category
      )}`}
    >
      {isEditing ? (
        <>
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-24 bg-transparent tracking-widest resize-none"
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
          <p>{todo.title}</p>
          <button onClick={handleEditClick}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="cursor-pointer hover:opacity-80 absolute left-1.5 bottom-1.5"
              opacity={0.2}
            />
          </button>
          <button onClick={() => onDeleteTodo(todo._id)}>
            <FontAwesomeIcon
              icon={faTrashCan}
              className="cursor-pointer hover:opacity-80 absolute right-1.5 bottom-1.5"
              opacity={0.2}
            />
          </button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
