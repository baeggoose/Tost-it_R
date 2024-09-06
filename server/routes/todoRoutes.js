const express = require("express");
const router = express.Router();

module.exports = (todoController) => {
  router.post("/add", todoController.addTodo);
  router.get("/", todoController.getTodos);
  router.put("/edit/:id", todoController.updateTodo);
  router.delete("/delete/:id", todoController.deleteTodo);

  return router;
};
