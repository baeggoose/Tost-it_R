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
    <ul>
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
