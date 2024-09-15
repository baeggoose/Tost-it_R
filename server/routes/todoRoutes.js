const express = require("express");
const router = express.Router();

module.exports = (todoController) => {
  router.post("/add", todoController.addTodo);
  router.get("/", todoController.getTodos);
  router.put("/edit/:id", todoController.updateTodo);
  router.put("/toggle/:id", todoController.toggleTodoComplete);
  router.delete("/delete/:id", todoController.deleteTodo);
  router.delete("/deleteCompleted", todoController.deleteCompletedTodo);

  return router;
};
