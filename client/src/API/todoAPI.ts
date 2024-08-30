import { baseURL } from "../utils/apiConfig";

export const fetchTodos = async () => {
  const response = await fetch(`${baseURL}/todo`);
  if (!response.ok) {
    throw new Error("할일 불러오기 중 오류 발생");
  }
  return response.json();
};

export const addTodo = async (todoText: string, selectedCategory: string) => {
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

  if (!response.ok) {
    throw new Error("할일 추가 중 오류 발생");
  }
  return response.json();
};

export const editTodo = async (id: string, editingTodoText: string) => {
  const response = await fetch(`${baseURL}/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: editingTodoText }),
  });

  if (!response.ok) {
    throw new Error("할일 수정 중 오류 발생");
  }
  return response.json();
};

export const deleteTodo = async (id: string) => {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("할일 삭제 중 오류 발생");
  }
};
