const express = require("express");
const router = express.Router();

const {
  create,
  fetchAll,
  fetch,
  updateSingle,
  tensai,
  fetchId,
} = require("../controllers/users");

router.post("/users", create);

//Fetch All Users
router.get("/users", fetchAll);

//Single Users
router.get("/users/:id", fetch);

//Update Single User
router.patch("/users/:id", updateSingle);

//Delete Single User
router.delete("/users/:id", tensai);

router.param("id", fetchId);

module.exports = router;
