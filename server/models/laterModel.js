const { ObjectId } = require("mongodb");

class LaterModel {
  constructor(db) {
    this.collection = db.collection("later");
  }

  async addLater(later, userId) {
    const result = await this.collection.insertOne({
      title: later,
      userId,
    });
    return this.collection.findOne({ _id: result.insertedId });
  }

  async getLaters(userId) {
    return this.collection.find({ userId }).toArray();
  }

  async updateLater(id, title) {
    const updateFields = {};
    if (title) updateFields.title = title;

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    return result.modifiedCount > 0
      ? this.collection.findOne({ _id: new ObjectId(id) })
      : null;
  }

  async deleteLater(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
module.exports = LaterModel;
