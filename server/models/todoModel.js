const { ObjectId } = require("mongodb");

class TodoModel {
  constructor(db) {
    this.collection = db.collection("todo");
  }

  async addTodo(todo, category, userId) {
    const result = await this.collection.insertOne({
      title: todo,
      category,
      userId,
      completed: false,
    });
    return this.collection.findOne({ _id: result.insertedId });
  }

  async getTodos(userId) {
    return this.collection.find({ userId }).toArray();
  }

  async updateTodo(id, title, category, userId) {
    const updateFields = {};
    if (title) updateFields.title = title;
    if (category) updateFields.category = category;

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    return result.modifiedCount > 0
      ? this.collection.findOne({ _id: new ObjectId(id) })
      : null;
  }

  async updateTodoComplete(id, completed) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed } }
    );
    return result.modifiedCount > 0
      ? this.collection.findOne({ _id: new ObjectId(id) })
      : null;
  }

  async deleteTodo(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = TodoModel;
