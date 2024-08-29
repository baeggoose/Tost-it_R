const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

let db;
const url = process.env.DB_URL;

new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("Tost-it");

    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.json("express!!");
});

app.post("/add", async (req, res) => {
  try {
    const { todo, category } = req.body;
    const result = await db
      .collection("todo")
      .insertOne({ title: todo, category });
    const newTodo = await db
      .collection("todo")
      .findOne({ _id: result.insertedId });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).send("할일 추가 중 서버 오류 발생");
  }
});

app.get("/todo", async (req, res) => {
  try {
    let result = await db.collection("todo").find().toArray();
    res.json(result);
  } catch (err) {
    res.status(500).send("할일 불러오기 중 서버 오류 발생");
  }
});

app.put("/edit/:id", async (req, res) => {
  try {
    const { title } = req.body;

    const todoItem = await db
      .collection("todo")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!todoItem) {
      return res.status(404).send("할 일을 찾을 수 없습니다.");
    }

    const result = await db
      .collection("todo")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { title } });

    if (result.modifiedCount > 0) {
      const updatedTodo = await db
        .collection("todo")
        .findOne({ _id: new ObjectId(req.params.id) });
      res.json(updatedTodo);
    } else {
      res.status(404).send("할 일을 찾을 수 없습니다.");
    }
  } catch (err) {
    res.status(500).send("할일 수정 중 오류 발생");
  }
});

app.get("/delete", async (req, res) => {
  try {
    let result = await db.collection("todo").deleteOne({
      _id: new ObjectId("66c9e2f7320af73ee3969ee9"),
    });
    res.redirect("/todo");
  } catch (err) {
    res.status(500).send("할일 삭제 중 오류 발생");
  }
});
