import { baseURL } from "../utils/apiConfig";

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

  return await response.text();
};
