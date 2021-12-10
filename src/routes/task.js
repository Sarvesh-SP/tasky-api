const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  create,
  fetchAll,
  fetch,
  update,
  tensai,
} = require("../controllers/task");

router.post("/tasks", auth, create);

router.get("/tasks", auth, fetchAll);

router.get("/tasks/:id", auth, fetch);

router.patch("/tasks/:id", auth, update);

router.delete("/tasks/:id", auth, tensai);

module.exports = router;
