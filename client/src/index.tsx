import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("루트 컨테이너를 찾을 수 없습니다.");
}
