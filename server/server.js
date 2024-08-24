const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
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
    res.status(500).send("데이터 추가 중 오류 발생");
  }
});

app.get("/todo", async (req, res) => {
  try {
    let result = await db.collection("todo").find().toArray();
    res.json(result);
  } catch (err) {
    res.status(500).send("데이터 가져오기 중 오류 발생");
  }
});
