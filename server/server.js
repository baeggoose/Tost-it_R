const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/authRoutes");
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
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(passport.session());

MongoClient.connect(url)
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("Tost-it");

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // 로그인 전략 설정
    passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await db.collection("user").findOne({ username });
          if (!user) {
            return done(null, false, { message: "없는 아이디입니다" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "비밀번호 불일치" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      })
    );

    passport.serializeUser((user, done) => {
      process.nextTick(() => {
        done(null, { id: user._id, username: user.username });
      });
    });

    passport.deserializeUser(async (user, done) => {
      try {
        const result = await db
          .collection("user")
          .findOne({ _id: new ObjectId(user.id) });
        delete result.password;
        process.nextTick(() => {
          return done(null, result);
        });
      } catch (error) {
        done(error);
      }
    });

    // 로그인, 회원가입 라우트
    app.use("/auth", authRoutes);

    // 할일 관련 라우트
    const todoModel = new TodoModel(db);
    const todoController = new TodoController(todoModel);
    app.use("/todos", todoRoutes(todoController));

    app.listen(8000, () => {
      console.log("http://localhost:8000 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });
