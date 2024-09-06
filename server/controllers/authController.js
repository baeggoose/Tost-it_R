const bcrypt = require("bcrypt");
const passport = require("passport");

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) return res.status(500).json({ message: error.message });
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "로그인 성공", user });
    });
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 중 오류 발생" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "세션 삭제 중 오류 발생" });
      }
      res.status(200).json({ message: "로그아웃 성공" });
    });
  });
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await req.db.collection("user").insertOne({
      username,
      password: hashedPassword,
    });
    res.status(201).send("회원가입 성공");
  } catch (error) {
    console.error(error);
    res.status(500).send("회원가입 중 서버 오류 발생");
  }
};
