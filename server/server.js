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
  res.send("express!!");
});

app.get("/todo", () => {
  db.collection("todo").insertOne({ title: "mongoDB 셋팅" });
});
