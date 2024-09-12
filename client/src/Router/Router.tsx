import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "../pages/splash/splash";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Todo from "../pages/Todo/Todo";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
