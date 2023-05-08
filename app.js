const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const app = express();
//* 導入自訂環境參數
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//* 載入資料庫
const db = require("./models");
const Todo = db.Todo;
const User = db.User;

const PORT = process.env.PORT;
//* 設定模板引擎
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
//* 設定 middleware
//* 設定抓取req.body
app.use(express.urlencoded({ extended: true }));
//* 修改路由方法，使語意化達成
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/users/login", (req, res) => {
  res.render("login");
});

app.post("/users/login", (req, res) => {
  res.send("login");
});

app.get("/users/register", (req, res) => {
  res.render("register");
});

app.post("/users/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.create({ name, email, password }).then((user) => res.redirect("/"));
});

app.get("/users/logout", (req, res) => {
  res.send("logout");
});

app.listen(PORT, () => {
  console.log(`APP is running on http://localhost:${PORT}`);
});
