const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const TodoModel = require("./models/todoModel");
const TodoController = require("./controllers/todoController");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const url = process.env.DB_URL;
let db;

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());
app.use(
  session({
    secret: "암호화에 쓸 비번",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.session());

MongoClient.connect(url)
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("Tost-it");

    const todoModel = new TodoModel(db);
    const todoController = new TodoController(todoModel);

    app.use("/", todoRoutes(todoController));

    app.post("/register", async (req, res) => {
      console.log(req.body);
      await db.collection("user").insertOne({
        username: req.body.username,
        password: req.body.password,
      });
      res.send("register success");
    });

    app.listen(8000, () => {
      console.log("http://localhost:8000 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });
