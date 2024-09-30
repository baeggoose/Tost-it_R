import React from "react";
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

  const sortedTodos = [...todos].sort((a, b) => {
    return (
      categoryOrder[a.category as keyof typeof categoryOrder] -
      categoryOrder[b.category as keyof typeof categoryOrder]
    );
  });

  return (
    <ul
      // h-fit
      className="xs:max-h-[425px] max-h-450 py-2 xs:px-4 px-6 grid grid-cols-2 xs:gap-3 gap-5 overflow-y-scroll"
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE and Edge */,
      }}
    >
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
