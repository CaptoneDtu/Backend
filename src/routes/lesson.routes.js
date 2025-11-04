

const express = require('express');
const auth = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate');

const lessonController = require('../controllers/lesson.controller');
const { createLessonSchema, deleteLessonSchema } = require("../validators/lesson.validator");
const router = express.Router();

router.post('/create-lesson', auth(["teacher"]), validateBody(createLessonSchema), lessonController.createLesson);
router.post('/delete-lesson', auth(["teacher"]), validateBody(deleteLessonSchema), lessonController.deleteLesson);
router.get('/get-lessons-in-course/:courseId', auth(["teacher", "student"]), lessonController.getLessonsByCourse);
router.get('/get-lesson/:lessonId', auth(["teacher", "student"]), lessonController.getLessonById);

module.exports = router;