import React from "react";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: { _id: string; title: string; category: string }[];
  onSaveEditTodo: (id: string, newTitle: string, newCategory: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onSaveEditTodo,
  onDeleteTodo,
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
    <ul className="h-fit max-h-450 pt-5 pb-5 pr-10 pl-10 grid grid-cols-2 gap-4 overflow-y-scroll">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onSaveEditTodo={onSaveEditTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
