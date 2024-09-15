import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoForm from "../../components/Todo/TodoForm";
import TodoList from "../../components/Todo/TodoList";
import {
  fetchTodos,
  addTodo,
  editTodo,
  deleteTodo,
  toggleTodoComplete,
  deleteCompletedTodos,
} from "../../API/todoAPI";
import { logoutUser } from "../../API/authAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRightFromBracket,
  faChevronDown,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

interface TodoItem {
  _id: string;
  title: string;
  category: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching loadTodos:", error);
        navigate("/");
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

  const handleSaveEditTodo = async (
    id: string,
    newTitle: string,
    newCategory: string
  ) => {
    try {
      const updatedTodo = await editTodo(id, newTitle, newCategory);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id
            ? {
                ...todo,
                title: updatedTodo.title,
                category: updatedTodo.category,
              }
            : todo
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await toggleTodoComplete(id, completed);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: updatedTodo.completed } : todo
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

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    try {
      const result = await deleteCompletedTodos();
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      console.log(`${result.count} completed todos deleted`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-main_skyblue flex flex-col justify-center items-center h-screen">
        <aside className="w-98 text-right mr-5 mb-5">
          <FontAwesomeIcon
            icon={faHouse}
            className="cursor-pointer mr-3"
            style={{ color: "#50b4fc" }}
            size="xl"
            onClick={handleRefresh}
          />
          <FontAwesomeIcon
            icon={faTrashCan}
            className="cursor-pointer mr-3"
            style={{ color: "#50b4fc" }}
            size="xl"
            onClick={() => handleDeleteCompletedTodos()}
          />
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="w-6 cursor-pointer inline"
            style={{ color: "#50b4fc" }}
            size="xl"
            onClick={handleLogout}
          />
        </aside>
        <section className="bg-main_bg_cloud max-w-7xl w-98 rounded-xl h-600 relative">
          <div className="sticky top-0 rounded-t-xl bg-main_bg_cloud ">
            <h1 className="font-mono pl-10 pt-9 text-3xl font-semibold">
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
            onToggleComplete={handleToggleComplete}
          />
          {/* 할일이 6개 이상일 때 아래로 향하는 아이콘 표시 */}
          {todos.length > 6 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <FontAwesomeIcon
                icon={faChevronDown}
                size="xl"
                className="text-point_blue"
              />
            </div>
          )}
        </section>
        <TodoForm onAddTodo={handleAddTodo} />
      </div>
    </>
  );
};

export default Todo;
