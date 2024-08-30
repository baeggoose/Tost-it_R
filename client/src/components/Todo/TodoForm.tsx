import React, { useState } from "react";

interface TodoFormProps {
  onAddTodo: (todoText: string, selectedCategory: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [todoText, setTodoText] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategory === "" || todoText === "") {
      alert("모든 필드를 채워주세요");
      return;
    }

    onAddTodo(todoText, selectedCategory);
    setTodoText("");
    setSelectedCategory("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={handleSelect} value={selectedCategory}>
        <option value="">언제할까요?</option>
        <option value="morning">아침</option>
        <option value="lunch">점심</option>
        <option value="dinner">저녁</option>
      </select>
      <input
        type="text"
        placeholder="할 일을 입력해주세요"
        maxLength={30}
        value={todoText}
        onChange={handleTodo}
      />
      <button type="submit">할일추가아이콘</button>
    </form>
  );
};

export default TodoForm;
