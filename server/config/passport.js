const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

module.exports = function (passport, db) {
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
};
