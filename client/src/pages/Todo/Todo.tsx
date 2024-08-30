import React, { useEffect, useState } from "react";
import TodoForm from "../../components/Todo/TodoForm";
import TodoList from "../../components/Todo/TodoList";
import { fetchTodos, addTodo, editTodo, deleteTodo } from "../../API/todoAPI";

interface TodoItem {
  _id: string;
  title: string;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadTodos();
  }, []);

  const handleAddTodo = async (todoText: string, selectedCategory: string) => {
    try {
      const newTodo = await addTodo(todoText, selectedCategory);
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditTodo = async (id: string, newTitle: string) => {
    try {
      const updatedTodo = await editTodo(id, newTitle);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, title: updatedTodo.title } : todo
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>오늘 할일</h1>
      <TodoList
        todos={todos}
        onSaveEditTodo={handleSaveEditTodo}
        onDeleteTodo={handleDeleteTodo}
      />
      <TodoForm onAddTodo={handleAddTodo} />
    </>
  );
};

export default Todo;
