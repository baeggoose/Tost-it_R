const bcrypt = require("bcrypt");
const passport = require("passport");

exports.checkSession = (req, res) => {
  console.log("Session check:", {
    isAuthenticated: req.isAuthenticated(),
    session: req.session,
    user: req.user,
  });

  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    return res.json({ isAuthenticated: false });
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.userId = user._id;
      console.log("Session after login:", req.session);
      console.log("User in session:", req.user);
      return res.status(200).json({ message: "로그인 성공" });
    });
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 중 서버 오류 발생" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "세션 삭제 중 서버 오류 발생" });
      }
      res.clearCookie("connect.sid", {
        path: "/",
        secure: true,
        sameSite: "none",
        httpOnly: false,
      });
      res.status(200).json({ message: "로그아웃 성공" });
    });
  });
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await req.db.collection("user").findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await req.db.collection("user").insertOne({
      username,
      password: hashedPassword,
    });

    const user = await req.db
      .collection("user")
      .findOne({ _id: result.insertedId });

    res.status(201).json({ message: "회원가입 성공", user });
  } catch (error) {
    res.status(500).json({ message: "회원가입 중 서버 오류 발생" });
  }
};
