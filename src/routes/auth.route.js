const express = require("express");
const auth = require("../middleware/auth.middleware");
const {  login,
  refresh,
  logout,
  getMe,
  adminOnly,
  promoteToTeacher,
  demoteToStudent,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", auth(), getMe);
router.get("/admin", auth(["admin"]), adminOnly);


module.exports = router;