import React, { useState, KeyboardEvent, useEffect } from "react";
import {
  faCheck,
  faEllipsis,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TodoItemProps {
  todo: { _id: string; title: string; category: string; completed: boolean };
  onSaveEditTodo: (id: string, newTitle: string, newCategory: string) => void;
  onDeleteTodo: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onSaveEditTodo,
  onDeleteTodo,
  onToggleComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.title);
  const [selectedCategory, setSelectedCategory] = useState(todo.category);
  const [isDone, setIsDone] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsDone(todo.completed);
  }, [todo.completed]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "morning":
        return "bg-red-300";
      case "lunch":
        return "bg-yellow-300";
      case "dinner":
        return "bg-blue-400";
      default:
        return "bg-gray-500";
    }
  };
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "morning":
        return "아침";
      case "lunch":
        return "점심";
      case "dinner":
        return "저녁";
      default:
        return category;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setIsDropdownOpen(false);
  };

  const handleSaveClick = () => {
    if (
      editingText.trim() === todo.title &&
      selectedCategory === todo.category
    ) {
      setIsEditing(false);
      return;
    }
    onSaveEditTodo(todo._id, editingText, selectedCategory);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingText(todo.title);
    setSelectedCategory(todo.category);
  };

  const handleDoneToggle = () => {
    const newIsDone = !isDone;
    setIsDone(newIsDone);
    onToggleComplete(todo._id, newIsDone);
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
        selectedCategory
      )}`}
    >
      {isEditing ? (
        <>
          <textarea
            value={editingText}
            maxLength={32}
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
          <button onClick={toggleDropdown}>
            <FontAwesomeIcon
              icon={faEllipsis}
              className="cursor-pointer hover:opacity-80 absolute right-7 bottom-1.5"
              opacity={0.2}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute bottom-7 bg-white border rounded shadow-lg p-1">
              {["morning", "lunch", "dinner"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className=" hover:bg-gray-100"
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          )}
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
          <p className={isDone ? "line-through" : ""}>{todo.title}</p>
          {isDone ? (
            <button onClick={() => onDeleteTodo(todo._id)}>
              <FontAwesomeIcon
                icon={faTrashCan}
                className="cursor-pointer hover:opacity-80 absolute left-1.5 bottom-1.5"
                opacity={0.2}
              />
            </button>
          ) : (
            <button onClick={handleEditClick}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="cursor-pointer hover:opacity-80 absolute left-1.5 bottom-1.5"
                opacity={0.2}
              />
            </button>
          )}
          <input
            checked={isDone}
            onChange={handleDoneToggle}
            type="checkbox"
            className="form-checkbox h-4 w-4 cursor-pointer absolute right-1.5 bottom-1.5 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500"
          ></input>
        </>
      )}
    </li>
  );
};

export default TodoItem;
