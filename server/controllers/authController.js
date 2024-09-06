const bcrypt = require("bcrypt");

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
