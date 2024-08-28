import React, { useEffect, useState } from "react";
import { baseURL } from "../../utils/apiConfig";

interface TodoItem {
  _id: string;
  title: string;
}

const Todo: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [todoText, setTodoText] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${baseURL}/todo`);
      const data = await response.json();
      setTodo(data);
    } catch (error) {
      console.error("데이터 불러오기 중 오류 발생", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOption === "") {
      alert("언제할지 선택해주세요");
      return;
    }

    if (todoText === "") {
      alert("할 일을 입력해주세요");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo: todoText,
          category: selectedOption,
        }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        alert("할 일이 추가되었습니다.");
        setTodo([...todo, newTodo]);
        setTodoText("");
        setSelectedOption("");
      } else {
        console.error("할일 추가 중 오류 발생");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류 발생", error);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };
  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  return (
    <>
      <ul>
        오늘 할일
        {todo.map((todo) => (
          <li key={todo._id}>
            <p>{todo.title}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddTodo}>
        <select onChange={handleSelect} value={selectedOption}>
          <option value="">언제할까요?</option>
          <option value="morning">아침</option>
          <option value="lunch">점심 </option>
          <option value="dinner">저녁</option>
        </select>
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          maxLength={30}
          value={todoText}
          onChange={handleTodo}
        />
        <button type="submit">할일 추가</button>
        {/* 폰트어썸 + 아이콘 추가 */}
      </form>
    </>
  );
};

export default Todo;
