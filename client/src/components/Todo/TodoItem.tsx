import React, { useState } from "react";

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
        return "bg-red-500";
      case "lunch":
        return "bg-yellow-500";
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
            className="w-full h-24 bg-transparent tracking-widest resize-none"
          />
          <button onClick={handleSaveClick}>저장체크아이콘</button>
          <button onClick={handleCancelClick}>취소아이콘</button>
        </>
      ) : (
        <>
          <p>{todo.title}</p>
          <button onClick={handleEditClick}>수정아이콘</button>
          <button onClick={() => onDeleteTodo(todo._id)}>삭제아이콘</button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
