const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");

module.exports = (app) => {
  //* passport 初始化
  app.use(passport.initialize());
  app.use(passport.session());

  //* 驗證策略

  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ where: { email } })
        .then((user) => {
          console.log("end findOne");
          if (!user) {
            return done(null, false, { message: "email is not exist!" });
          }
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { message: "password is incorrect!" });
          });
        })
        .catch((err) => done(err, null));
    })
  );

  //* 序列化反序列化
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => done(null, user.toJSON()))
      .catch((err) => done(err, null));
  });
};
