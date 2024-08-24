const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
require("dotenv").config();

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

app.get("/add", async (req, res) => {
  try {
    await db.collection("todo").insertOne({ title: "mongoDB 셋팅" });
    res.send("데이터가 성공적으로 추가되었습니다.");
  } catch (err) {
    res.status(500).send("할일 추가 중 오류 발생");
  }
});

app.get("/todo", async (req, res) => {
  try {
    let result = await db.collection("todo").find().toArray();
    res.json(result);
  } catch (err) {
    res.status(500).send("할일 불러오기 중 오류 발생");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    let result = await db
      .collection("todo")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).send("수정할 할일 불러오기 중 오류 발생");
  }
});
app.get("/edit", async (req, res) => {
  try {
    let result = await db
      .collection("todo")
      .updateOne(
        { _id: new ObjectId("66c9de1f3f1cbd90e280b36a") },
        { $set: { title: "할일 수정", content: "수정되는지 테스트" } }
      );
    res.redirect("/todo");
  } catch (err) {
    res.status(500).send("할일 수정 중 오류 발생");
  }
});
