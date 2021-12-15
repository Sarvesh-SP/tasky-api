const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  create,
  upload,
  updateSingle,
  tensai,
  login,
  logout,
  maxLogout,
  readProfile,
  imgDelete,
  fetchImg,
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

//File Upload
router.post("/users/me/avatar", auth, upload);

router.get("/users/me/avatar/:id", fetchImg);

//Delete Single User
router.delete("/users/me", auth, tensai);

router.delete("/users/me/avatar", auth, imgDelete);

module.exports = router;
