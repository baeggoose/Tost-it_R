import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TodoForm from "../../components/Todo/TodoForm";
import TodoList from "../../components/Todo/TodoList";
import { fetchTodos, addTodo, editTodo, deleteTodo } from "../../API/todoAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

interface TodoItem {
  _id: string;
  title: string;
  category: string;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
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

  const handleRefresh = () => {
    location.reload();
  };

  return (
    <>
      <div className="bg-main_skyblue flex flex-col justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faHouse}
          className="cursor-pointer mr-3 "
          style={{ color: "#50b4fc" }}
          size="xl"
          onClick={handleRefresh}
        />
        <section className="bg-main_bg_cloud max-w-7xl w-98 rounded-xl h-600 relative">
          <div className="sticky top-0 pb-5 rounded-t-xl bg-main_bg_cloud ">
            <h1
              className="font-mono pl-10 pt-9 text-3xl font-semibold cursor-pointer"
              onClick={handleRefresh}
            >
              Today
            </h1>
            <p className="font-mono  pl-10 pt-3 text-sm">
              What are you working on today?
            </p>
          </div>
          <TodoList
            todos={todos}
            onSaveEditTodo={handleSaveEditTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        </section>
        <TodoForm onAddTodo={handleAddTodo} />
      </div>
    </>
  );
};

export default Todo;
