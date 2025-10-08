const express = require("express");
const auth = require("../middleware/auth.middleware");
const {
  register,
  login,
  refresh,
  logout,
  getMe,
  adminOnly,
  promoteToTeacher,
  demoteToStudent,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", auth(), getMe);
router.get("/admin", auth(["admin"]), adminOnly);
router.get("/promoteToTeacher", auth(["admin"]), promoteToTeacher);
router.get("/demoteToStudent", auth(["admin"]), demoteToStudent);

module.exports = router;