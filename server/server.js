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
            return done(null, false, { message: "아이디 DB에 없음" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "비번불일치" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      })
    );

    passport.serializeUser((user, done) => {
      done(null, { id: user._id, username: user.username });
    });

    passport.deserializeUser(async (user, done) => {
      try {
        const result = await db
          .collection("user")
          .findOne({ _id: new ObjectId(user.id) });
        delete result.password;
        done(null, result);
      } catch (error) {
        done(error);
      }
    });

    // 로그인 라우트
    app.post("/login", (req, res, next) => {
      passport.authenticate("local", (error, user, info) => {
        if (error) return res.status(500).json({ message: error.message });
        if (!user) return res.status(401).json({ message: info.message });

        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.status(200).json({ message: "로그인 성공", user });
        });
      })(req, res, next);
    });

    // 회원가입 라우트
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
