import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus as plus } from "@fortawesome/free-solid-svg-icons";

interface TodoFormProps {
  onAddTodo: (todoText: string, selectedCategory: string) => void;
}

const categories = [
  { value: "morning", label: "아침" },
  { value: "lunch", label: "점심" },
  { value: "dinner", label: "저녁" },
];

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    value: "",
    label: "시간",
  });
  const [todoText, setTodoText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategory.value === "" || todoText === "") {
      alert("시간과 할일을 모두 채워주세요");
      return;
    }

    onAddTodo(todoText, selectedCategory.value);
    setTodoText("");
    setSelectedCategory({ value: "", label: "시간" });
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className=" flex-col text-lx">
      <form
        className="flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={`text-white bg-point_blue font-medium p-2 ${
              isOpen ? "rounded-t-lg " : "rounded-lg shadow"
            }`}
          >
            {selectedCategory.label}
          </button>

          {isOpen && (
            <div className="absolute bg-point_blue rounded-b-lg text-white text-center w-full border-t border-white">
              {categories.map((category, index) => (
                <button
                  key={category.value}
                  className={`block w-full py-2 ${
                    index > 0 ? "border-t border-white" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsOpen(false);
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          className="m-4 w-64 rounded-md shadow bg-point_blue font-normal p-2 pr-10 placeholder-white"
          placeholder="할 일을 입력해주세요"
          maxLength={32}
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
            style={{ color: "#fff", height: "45px" }}
          />
        </button>
      </form>
    </section>
  );
};

export default TodoForm;
