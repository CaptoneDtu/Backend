const express = require("express");
const authRoutes = require("./auth.route");
const courseRouter = require("./course.routes");
const lessonRouter = require("./lesson.routes");
const userRoutes = require("./users.route");
const flashcardRoutes = require("./flashcard.routes");
const grammarRoutes = require("./grammar.routes");
const vocabularyRoutes = require("./vocabulary.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRouter);
router.use("/lessons", lessonRouter);
router.use("/users", userRoutes);
router.use("/flashcards", flashcardRoutes);
router.use("/grammars", grammarRoutes);
router.use("/vocabularies", vocabularyRoutes);

module.exports = router;