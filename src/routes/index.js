
const express = require("express");
const authRoutes = require("./auth.route");
const courseRouter = require("./course.routes");
const lessonRouter = require("./lesson.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRouter);
router.use("/lessons", lessonRouter);
module.exports = router;