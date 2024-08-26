import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "../pages/Todo/Todo";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
