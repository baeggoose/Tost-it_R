import React from "react";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: { _id: string; title: string }[];
  onSaveEditTodo: (id: string, newTitle: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onSaveEditTodo,
  onDeleteTodo,
}) => {
  return (
    <ul className="h-fit max-h-450 pt-5 pb-5 pr-10 pl-10 grid grid-cols-2 gap-4 overflow-y-scroll">
      {todos.map((todo) => (
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
