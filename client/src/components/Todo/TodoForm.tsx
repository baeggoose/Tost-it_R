import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus as plus } from "@fortawesome/free-solid-svg-icons";

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
    <section className="mt-5 flex-col text-lx">
      <form
        className="flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <select
          className="h-10 text-white rounded-md shadow shadow-black bg-point_blue font-medium p-2"
          onChange={handleSelect}
          value={selectedCategory}
        >
          <option value="">언제할까요?</option>
          <option value="morning">아침</option>
          <option value="lunch">점심</option>
          <option value="dinner">저녁</option>
        </select>
        <input
          type="text"
          className="m-4 w-64 rounded-md shadow shadow-black bg-point_blue font-normal p-2 pr-10 placeholder-white "
          placeholder="할 일을 입력해주세요"
          maxLength={30}
          value={todoText}
          onChange={handleTodo}
        />
        <button
          type="submit"
          className="cursor-pointer flex items-center justify-center"
        >
          <FontAwesomeIcon
            icon={plus}
            size="2xl"
            style={{
              color: "#ffff",
              height: "40px",
              width: "40px",
            }}
          />
        </button>
      </form>
    </section>
  );
};

export default TodoForm;
