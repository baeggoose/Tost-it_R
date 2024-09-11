import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../API/authAPI";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError(null);
    }

    const isFormValid =
      username.length > 0 &&
      password.length >= 4 &&
      password === passwordConfirm;
    setIsValid(isFormValid);
  }, [username, password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const response = await registerUser(username, password);
      console.log(response);
      if (response.message === "회원가입 성공") {
        navigate("/login");
      } else {
        setError(response.message || "회원가입 실패. 다시 시도해주세요.");
      }
    } catch (error: any) {
      setError(error.message || "회원가입 실패. 다시 시도해주세요.");
    }
  };

  return (
    <form
      className="form-box flex flex-col justify-center items-center h-screen "
      onSubmit={handleSubmit}
    >
      <h1 className="mb-10 h-7 font-medium text-2xl">회원가입</h1>
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
          placeholder="영문자 또는 숫자 또는 특수문자 조합 4글자 이상"
          name="password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
      <fieldset className="mb-4">
        <label className="text-xs" htmlFor="passwordConfirm">
          비밀번호 확인.
        </label>
        <input
          className="w-80 text-sm px-2 py-2 border-b block outline-0 focus:border-sky-500"
          placeholder="비밀번호 재입력"
          name="password"
          type="password"
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </fieldset>
      {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
      <button
        type="submit"
        className={`text-white font-bold w-80 py-2 h-11 mt-8 mb-5 rounded-full text-sm ${
          isValid ? "bg-sky-500" : "bg-sky-200"
        } `}
      >
        회원가입
      </button>
    </form>
  );
}

export default Register;
