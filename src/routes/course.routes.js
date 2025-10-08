
const express = require('express');
const auth = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validateBody');
const courseController = require('../controllers/course.controller');
const {createCourseSchema, addStudentToCourseSchema, kickStudentFromCourseSchema} = require('../vadilators/courses.vadilator');

const router = express.Router();



router.post('/create', auth(["admin"]), validateBody(createCourseSchema), courseController.createCourseForTeacher);
router.get('/student', auth(["student"]), courseController.getCoursesForStudent);
router.get('/', auth(["teacher"]), courseController.getCoursesForTeacher);
router.get('/:courseId', auth(["teacher", "student"]), courseController.getCourseDetails);
router.post('/add-student', auth(["teacher"]), validateBody(addStudentToCourseSchema), courseController.addStudentToCourseByEmail);
router.post('/kick-student', auth(["teacher"]), validateBody(kickStudentFromCourseSchema), courseController.kickStudentFromCourseByEmail);

module.exports = router;
