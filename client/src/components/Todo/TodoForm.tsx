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
    <section className="flex items-center text-lx">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className={`text-white bg-point_blue font-medium p-2 ${
            isOpen ? "xs:rounded-b-lg sm:rounded-t-lg" : "rounded-lg shadow"
          }`}
        >
          {selectedCategory.label}
        </button>

        <div
          className={`absolute xs:bottom-full xs:transform xs:translate-y-1 bg-point_blue xs:rounded-t-lg sm:rounded-b-lg text-white text-center w-full xs:border-b sm:border-t border-white overflow-hidden transition-all ease-in-out duration-300 ${
            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {categories.map((category, index) => (
            <button
              key={category.value}
              className={`block w-full py-2 ${
                index > 0 ? "border-t border-white" : ""
              } transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
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
      </div>

      <form className="flex justify-center" onSubmit={handleSubmit}>
        <input
          type="text"
          className="xs:m-3 m-4 xs:w-56 w-64 rounded-md shadow bg-point_blue font-normal p-2 placeholder-white"
          placeholder="할 일을 입력해주세요"
          maxLength={32}
          value={todoText}
          onChange={handleTodo}
        />

        <button type="submit" className="cursor-pointer">
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
