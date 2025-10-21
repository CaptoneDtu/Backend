
const express = require("express");
const authRoutes = require("./auth.route");
const courseRouter = require("./course.routes");
const lessonRouter = require("./lesson.routes");
const examRouter = require("./exam.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRouter);
router.use("/exams", examRouter);
router.use("/lessons", lessonRouter);
module.exports = router;