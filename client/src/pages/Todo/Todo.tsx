import React, { useEffect, useState } from "react";

interface TodoItem {
  _id: string;
  title: string;
  content?: string;
}

const Todo: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8080/todo");
      const data = await response.json();
      console.log(data);
      setTodo(data);
    } catch (error) {
      console.error("데이터 불러오기 중 오류 발생", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <>
      <ul>
        오늘 할일
        {todo.map((todo) => (
          <li key={todo._id}>
            <h3>{todo.title}</h3>
            <p>{todo.content}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
