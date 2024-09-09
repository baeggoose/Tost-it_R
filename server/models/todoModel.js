const { ObjectId } = require("mongodb");

class TodoModel {
  constructor(db) {
    this.collection = db.collection("todo");
  }

  async addTodo(todo, category) {
    const result = await this.collection.insertOne({ title: todo, category });
    return this.collection.findOne({ _id: result.insertedId });
  }

  async getTodos() {
    return this.collection.find().toArray();
  }

  async updateTodo(id, title, category) {
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

  async deleteTodo(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = TodoModel;
