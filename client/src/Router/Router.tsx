import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Auth/Register";
import Todo from "../pages/Todo/Todo";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/todo" element={<Todo />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
