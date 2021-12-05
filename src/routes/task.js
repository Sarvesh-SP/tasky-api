const express = require("express");
const router = express.Router();

const {
  create,
  fetchAll,
  fetch,
  update,
  tensai,
} = require("../controllers/task");

router.post("/tasks", create);

router.get("/tasks", fetchAll);

router.get("/tasks/:id", fetch);

router.patch("/tasks/:id", update);

router.delete("/tasks/:id", tensai);

module.exports = router;
