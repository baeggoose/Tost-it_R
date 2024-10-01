import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useState } from "react";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: { _id: string; title: string; category: string; completed: boolean }[];
  onSaveEditTodo: (id: string, newTitle: string, newCategory: string) => void;
  onDeleteTodo: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onSaveEditTodo,
  onDeleteTodo,
  onToggleComplete,
}) => {
  const categoryOrder = {
    morning: 1,
    lunch: 2,
    dinner: 3,
  };
  const [isScroll, setIsScroll] = useState(false);

  const sortedTodos = [...todos].sort((a, b) => {
    return (
      categoryOrder[a.category as keyof typeof categoryOrder] -
      categoryOrder[b.category as keyof typeof categoryOrder]
    );
  });

  const todoListRef = useRef<HTMLUListElement>(null);

  const toggleToUPDown = () => {
    isScroll ? scrollToTop() : scrollToBottom();
    setIsScroll(!isScroll);
  };

  const scrollToTop = () => {
    if (todoListRef.current) {
      todoListRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  const scrollToBottom = () => {
    if (todoListRef.current) {
      todoListRef.current.scrollTo({
        top: todoListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <ul
      ref={todoListRef}
      className="xs:max-h-[424px] mb:max-h-[424px] sm:max-h-450 py-2 xs:px-4 mb:px-5 px-6 grid grid-cols-2 xs:gap-3 mb:gap-3 gap-5 overflow-y-scroll"
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE and Edge */,
      }}
    >
      {todos.length > 6 && (
        <FontAwesomeIcon
          icon={faUpDown}
          size="xl"
          className="text-point_blue cursor-pointer absolute flex justify-center hover:fade xs:bottom-2 bottom-4 xs:right-4 right-6 "
          onClick={toggleToUPDown}
        />
      )}
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onSaveEditTodo={onSaveEditTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
