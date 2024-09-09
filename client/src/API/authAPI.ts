import { baseURL } from "../utils/apiConfig";

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${baseURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }
  const data = await response.json();

  localStorage.setItem("access_token", data.token);

  return data;
};
export const logoutUser = async () => {
  const response = await fetch(`${baseURL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  localStorage.removeItem("access_token");
};

export const registerUser = async (username: string, password: string) => {
  const response = await fetch(`${baseURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return await response.json();
};
