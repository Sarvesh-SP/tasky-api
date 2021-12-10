const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  create,

  fetch,
  updateSingle,
  tensai,

  login,
  logout,
  maxLogout,
  readProfile,
} = require("../controllers/users");

//Login
router.post("/users/login", login);

//Create User - Signup
router.post("/users", create);

//Read Profile
router.get("/users/me", auth, readProfile);

//Single Users
// router.get("/users/:id", fetch);

//Update Single User
router.patch("/users/me", auth, updateSingle);

//Logout
router.post("/users/logout", auth, logout);

//Logout All Sessions
router.post("/users/logoutAll", auth, maxLogout);

//Delete Single User
router.delete("/users/me", auth, tensai);

module.exports = router;
