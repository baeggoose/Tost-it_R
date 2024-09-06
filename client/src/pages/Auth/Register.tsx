import React, { useState } from "react";
import { registerUser } from "../../API/authAPI";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(username, password);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      className="form-box flex flex-col justify-center items-center h-screen "
      onSubmit={handleSubmit}
    >
      <h1 className="mb-10 h-7 font-medium text-2xl">회원가입</h1>
      <fieldset className="mb-4">
        <label className="text-xs" htmlFor="email">
          이메일
        </label>
        <input
          className="w-80 text-sm px-2 py-2 border-b block outline-0 focus:border-sky-500"
          placeholder="todo@list.com"
          name="username"
          type="email"
          id="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-4">
        <label className="text-xs" htmlFor="password">
          비밀번호
        </label>
        <input
          className="w-80 text-sm px-2 py-2 border-b block outline-0 focus:border-sky-500"
          placeholder="특수문자,숫자,영문자 조합 8글자 이상"
          name="password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-4">
        <label className="text-xs" htmlFor="passwordConfirm">
          비밀번호 확인
        </label>
        <input
          className="w-80 text-sm px-2 py-2 border-b block outline-0 focus:border-sky-500"
          placeholder="비밀번호 재입력"
          name="password"
          type="password"
          id="passwordConfirm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
      <button
        type="submit"
        className={`text-white font-bold py-2 h-11 mt-8 mb-5 rounded-full text-sm ${"bg-sky-500"} `}
      >
        전송
      </button>
    </form>
  );
}

export default Register;
