const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const TodoModel = require("./models/todoModel");
const TodoController = require("./controllers/todoController");
const configurePassport = require("./config/passport");

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  })
);
app.use(express.json());

const url = process.env.DB_URL;
let db;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1시간
      secure: false,
      // secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      // domain: "localhost",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(url)
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("Tost-it");

    configurePassport(passport, db);

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    const todoModel = new TodoModel(db);
    const todoController = new TodoController(todoModel);

    app.use("/todos", todoRoutes(todoController));
    app.use("/auth", authRoutes);

    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch(console.error);
