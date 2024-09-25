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
  faCloud,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import WeatherModal from "../../components/Weather/WeatherModal";
import PomodoroTimer from "../../components/Pomodoro/PomodoroTimer";

interface TodoItem {
  _id: string;
  title: string;
  category: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("ko-KR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setCurrentTime(formattedTime);
    };
    updateTime();
  }, []);

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
  }, [navigate]);

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

  const togglePomodoro = () => {
    setIsPomodoroOpen(!isPomodoroOpen);
  };

  const handleDeleteCompletedTodos = async () => {
    try {
      const result = await deleteCompletedTodos();
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      console.log(`완료된 ${result.count}개의 할 일들 삭제 완료`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const toggleWeatherModal = () => {
    setIsWeatherModalOpen(!isWeatherModalOpen);
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
            icon={faClock}
            className="cursor-pointer mr-3"
            style={{ color: "#50b4fc" }}
            size="xl"
            onClick={togglePomodoro}
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
          <div className="font-mono sticky pl-10 top-0 rounded-t-xl bg-main_bg_cloud ">
            <h1 className="pt-9 text-3xl font-semibold">
              Today
              <span className="pl-3 text-base font-normal">{currentTime}</span>
              <FontAwesomeIcon
                icon={faCloud}
                className="pl-2 cursor-pointer mr-3"
                style={{ color: "#50b4fc" }}
                size="xs"
                onClick={toggleWeatherModal}
              />
            </h1>
            <p className="py-2 text-sm">What are you working on today?</p>
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
        {isWeatherModalOpen && (
          <WeatherModal
            isOpen={isWeatherModalOpen}
            onClose={() => setIsWeatherModalOpen(false)}
          />
        )}
        {isPomodoroOpen && (
          <PomodoroTimer onClose={() => setIsPomodoroOpen(false)} />
        )}
      </div>
    </>
  );
};

export default Todo;
