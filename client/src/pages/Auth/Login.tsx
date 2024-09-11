import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../API/authAPI";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isFormValid = username.length > 0 && password.length > 0;
    setIsValid(isFormValid);
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const user = await loginUser(username, password);
      // console.log("로그인 성공:", user);
      navigate("/todos");
    } catch (error) {
      setError("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <form
      className="form-box flex flex-col justify-center items-center h-screen "
      onSubmit={handleSubmit}
    >
      <h1 className="mb-10 h-7 font-medium text-2xl">로그인</h1>
      {error && <p className="text-red-500">{error}</p>}
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
          name="password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>

      <button
        type="submit"
        className={`text-white font-bold w-80 py-2 h-11 mt-8 mb-5 rounded-full text-sm ${
          isValid ? "bg-sky-500" : "bg-sky-200"
        } `}
      >
        로그인
      </button>
      <Link to="/register" className="text-sm text-center">
        이메일로 회원가입
      </Link>
    </form>
  );
}
export default Login;
