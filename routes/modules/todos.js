const express = require("express");
const router = express.Router();
//* 載入資料庫
const db = require("../../models");
const Todo = db.Todo;
//* 新增
router.get("/new", (req, res) => {
  res.render("new");
});
router.post("/", (req, res) => {
  const name = req.body.name;
  const userId = req.user.id;
  Todo.create({ name, userId })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//*修改
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  Todo.findByPk(id)
    .then((todo) => {
      res.render("edit", { todo: todo.toJSON() });
    })
    .catch((err) => console.log(err));
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const isDone = req.body.isDone === "on";
  Todo.findByPk(id)
    .then((todo) => {
      todo.update({ name, isDone });
      res.redirect(`/todos/${id}`);
    })
    .catch((err) => console.log(err));
});

//* 詳細
router.get("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findByPk(id)
    .then((todo) => res.render("detail", { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});

//* 刪除
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Todo.findByPk(id)
    .then((todo) => {
      todo.destroy();
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
