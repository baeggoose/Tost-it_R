import { baseURL } from "../utils/apiConfig";

// 할일 목록 가져오기
export const fetchTodos = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${baseURL}/todos`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("할일 불러오기 중 오류 발생");
  }
  return response.json();
};

// 할일 추가하기
export const addTodo = async (todoText: string, selectedCategory: string) => {
  const response = await fetch(`${baseURL}/todos/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todo: todoText,
      category: selectedCategory,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("할일 추가 중 오류 발생");
  }
  return response.json();
};

// 할일 수정하기
export const editTodo = async (
  id: string,
  editingTodoText: string,
  selectedCategory: string
) => {
  const response = await fetch(`${baseURL}/todos/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: editingTodoText,
      category: selectedCategory,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("할일 수정 중 오류 발생");
  }
  return response.json();
};

// 할일 완료
export const toggleTodoComplete = async (id: string, completed: boolean) => {
  const response = await fetch(`${baseURL}/todos/toggle/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error("Failed to toggle todo complete status");
  }

  return response.json();
};

// 할일 삭제하기
export const deleteTodo = async (id: string) => {
  const response = await fetch(`${baseURL}/todos/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("할일 삭제 중 오류 발생");
  }
};
