const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const usePassport = require("./config/passport");
const flash = require("connect-flash");
const app = express();
//* 導入自訂環境參數
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//* 載入路由
const Router = require("./routes");

const PORT = process.env.PORT;
//* 設定模板引擎
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
//* 設定 middleware
//* 設定抓取req.body
app.use(express.urlencoded({ extended: true }));
//* 修改路由方法，使語意化達成
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
usePassport(app);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

//* 分配路由
app.use(Router);

//* 啟動伺服器
app.listen(PORT, () => {
  console.log(`APP is running on http://localhost:${PORT}`);
});
