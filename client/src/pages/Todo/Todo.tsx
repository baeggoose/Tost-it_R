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
  // const [isScroll, setIsScroll] = useState(false);
  const navigate = useNavigate();
  // const todoListRef = useRef<HTMLDivElement>(null);

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
      const completedTodos = todos.filter((todo) => todo.completed);

      if (completedTodos.length === 0) {
        alert("삭제할 완료된 일이 0개입니다.");
        return;
      }

      const result = await deleteCompletedTodos();
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      // console.log(`완료된 ${result.count}개의 할 일들 삭제 완료`);
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
      <div className="bg-main_skyblue flex flex-col justify-center items-center min-w-[360px] min-h-[640px] h-screen">
        <aside className="xs:w-80 mb:w-96 sm:w-98 text-right mr-5 my-3">
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
        <section className="bg-main_bg_cloud rounded-xl relative xs:w-80 mb:w-96 sm:w-98 xs:h-[520px] mb:h-[520px] sm:h-600">
          <div className="font-mono sticky xs:pl-5 mb:pl-5 pl-10 rounded-t-xl bg-main_bg_cloud ">
            <h1 className="xs:pt-2 mb:pt-2 pt-9 xs:text-xl mb:text-xl text-3xl font-semibold">
              Today
              <span className="xs:pl-1.5 pl-3 text-base font-normal">
                {currentTime}
              </span>
              <FontAwesomeIcon
                icon={faCloud}
                className="pl-2 cursor-pointer text-2xl xs:text-xl"
                style={{ color: "#50b4fc" }}
                onClick={toggleWeatherModal}
              />
            </h1>
            <p className="xs:py-0 mb:py-0 py-2 text-sm">
              What are you working on today?
            </p>
          </div>
          <TodoList
            todos={todos}
            onSaveEditTodo={handleSaveEditTodo}
            onDeleteTodo={handleDeleteTodo}
            onToggleComplete={handleToggleComplete}
          />
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
