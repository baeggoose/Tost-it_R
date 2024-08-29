import React, { useEffect, useState } from "react";
import { baseURL } from "../../utils/apiConfig";

interface TodoItem {
  _id: string;
  title: string;
}

const Todo: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [todoText, setTodoText] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null); // 현재 수정 중인 할 일의 ID
  const [editingTodoText, setEditingTodoText] = useState<string>(""); // 수정 중인 할 일의 텍스트

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${baseURL}/todo`);
      const data = await response.json();
      setTodo(data);
    } catch (error) {
      console.error("할일 불러오기 중 오류 발생", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategory === "") {
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
          category: selectedCategory,
        }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        alert("할 일이 추가되었습니다.");
        setTodo([...todo, newTodo]);
        setTodoText("");
        setSelectedCategory("");
      } else {
        console.error("할일 추가 중 오류 발생");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류 발생", error);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  const handleEditTodo = (id: string, title: string) => {
    setEditingTodoId(id);
    setEditingTodoText(title);
  };

  const handleSaveEditTodo = async (id: string) => {
    try {
      const response = await fetch(`${baseURL}/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTodoText,
        }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodo((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, title: updatedTodo.title } : todo
          )
        );
        setEditingTodoId(null);
      } else {
        console.error("할일 수정 중 오류 발생");
      }
    } catch (error) {
      console.error("데이터 수정 중 오류 발생", error);
    }
  };

  const handleChangeEditTodoText = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditingTodoText(e.target.value);
  };

  return (
    <>
      <ul>
        오늘 할일
        {todo.map((todo) => (
          <li key={todo._id}>
            {editingTodoId === todo._id ? (
              <>
                <textarea
                  value={editingTodoText}
                  onChange={handleChangeEditTodoText}
                />
                <button onClick={() => handleSaveEditTodo(todo._id)}>
                  저장체크아이콘
                </button>
              </>
            ) : (
              <>
                <p>{todo.title}</p>
                <button onClick={() => handleEditTodo(todo._id, todo.title)}>
                  수정아이콘
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddTodo}>
        <select onChange={handleSelect} value={selectedCategory}>
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
        <button type="submit">할일추가아이콘</button>
      </form>
    </>
  );
};

export default Todo;
