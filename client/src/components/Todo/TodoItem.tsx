import React, { useState } from "react";

interface TodoItemProps {
  todo: { _id: string; title: string };
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSaveEditTodo(todo._id, editingText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingText(todo.title);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
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
