import { baseURL } from "../utils/apiConfig";

// 나중에벌레 목록 가져오기
export const fetchLaters = async () => {
  try {
    const response = await fetch(`${baseURL}/laters`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("나중에벌레 불러오기 중 오류 발생");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetchLaters:", error);
    throw error;
  }
};

// 나중에벌레 추가하기
export const addLater = async (laterText: string) => {
  const response = await fetch(`${baseURL}/laters/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      later: laterText,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("나중에벌레 추가 중 오류 발생");
  }
  return response.json();
};

// 나중에벌레 수정하기
export const editLater = async (id: string, editingLaterText: string) => {
  const response = await fetch(`${baseURL}/laters/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: editingLaterText,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("나중에벌레 수정 중 오류 발생");
  }
  return response.json();
};

// 나중에벌레 삭제하기
export const deleteLater = async (id: string) => {
  const response = await fetch(`${baseURL}/laters/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("나중에벌레 삭제 중 오류 발생");
  }
};
