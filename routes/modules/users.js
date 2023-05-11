const express = require("express");
const router = express.Router();
const db = require("../../models");
const User = db.User;
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let errors = [];
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "每一個欄位都是必填！" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼和確認密碼不一致！" });
  }
  if (errors.length) {
    return res.render("register", { user: req.body, errors });
  }
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      errors.push({ message: "信箱已經註冊！" });
      return res.render("register", {
        name,
        email,
        errors,
      });
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "你已經成功登出了！");
    res.redirect("/users/login");
  });
});

module.exports = router;
