class TodoController {
  constructor(todoModel) {
    this.todoModel = todoModel;
  }

  addTodo = async (req, res) => {
    try {
      const { todo, category } = req.body;
      const userId = req.user._id;
      const newTodo = await this.todoModel.addTodo(todo, category, userId);
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(500).send("할일 추가 중 서버 오류 발생");
    }
  };

  getTodos = async (req, res) => {
    try {
      const userId = req.user._id;
      const todos = await this.todoModel.getTodos(userId);
      res.json(todos);
    } catch (err) {
      res.status(500).send("할일 불러오기 중 서버 오류 발생");
    }
  };

  updateTodo = async (req, res) => {
    try {
      const { title, category } = req.body;
      const updatedTodo = await this.todoModel.updateTodo(
        req.params.id,
        title,
        category
      );
      if (updatedTodo) {
        res.json(updatedTodo);
      } else {
        res.status(404).send("할 일을 찾을 수 없습니다.");
      }
    } catch (err) {
      res.status(500).send("할일 수정 중 서버 오류 발생");
    }
  };

  toggleTodoComplete = async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      const updatedTodo = await this.todoModel.updateTodoComplete(
        id,
        completed
      );
      if (updatedTodo) {
        res.json(updatedTodo);
      } else {
        res.status(404).send("할 일을 찾을 수 없습니다.");
      }
    } catch (err) {
      res.status(500).send("할일 상태 변경 중 서버 오류 발생");
    }
  };

  deleteTodo = async (req, res) => {
    try {
      const deleted = await this.todoModel.deleteTodo(req.params.id);
      if (deleted) {
        res.status(200).send("할일이 성공적으로 삭제되었습니다.");
      } else {
        res.status(404).send("할일을 찾을 수 없습니다.");
      }
    } catch (err) {
      res.status(500).send("할일 삭제 중 서버 오류 발생");
    }
  };

  deleteCompletedTodo = async (req, res) => {
    try {
      const userId = req.user._id;
      const result = await this.todoModel.deleteCompletedTodos(userId);
      res
        .status(200)
        .json({
          message: "할일들이 성공적으로 삭제되었습니다.",
          count: result,
        });
    } catch (error) {
      res.status(500).json({ error: "할일들 삭제 중 서버 오류 발생" });
    }
  };
}

module.exports = TodoController;
