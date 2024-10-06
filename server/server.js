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
const laterRoutes = require("./routes/laterRoutes");
const LaterModel = require("./models/laterModel");
const LaterController = require("./controllers/laterController");
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
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(url)
  .then((client) => {
    db = client.db("Tost-it");

    configurePassport(passport, db);

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    const todoModel = new TodoModel(db);
    const todoController = new TodoController(todoModel);
    const laterModel = new LaterModel(db);
    const laterController = new LaterController(laterModel);

    const authMiddleware = (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    };

    app.use("/api/laters", authMiddleware, laterRoutes(laterController));
    app.use("/api/todos", authMiddleware, todoRoutes(todoController));
    app.use("/api/auth", authRoutes);

    app.get("/todos", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`서버 실행중 ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
