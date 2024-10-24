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

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:9000",
      "https://tost-it-r.vercel.app",
      "https://tost-it-r-baeggooses-projects.vercel.app",
      // "https://baeggoose.shop",
    ],
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
    proxy: true,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000, // 12시간
      // domain: ".baeggoose.shop",
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

    app.get("/health", (req, res) => {
      res.status(200).send("OK");
    });

    const todoModel = new TodoModel(db);
    const todoController = new TodoController(todoModel);
    const laterModel = new LaterModel(db);
    const laterController = new LaterController(laterModel);

    const authMiddleware = (req, res, next) => {
      console.log("Auth check:", {
        isAuthenticated: req.isAuthenticated(),
        session: req.session,
        user: req.user,
      });

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
