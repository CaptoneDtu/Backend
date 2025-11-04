
const express = require('express');
const auth = require('../middleware/auth.middleware');
const { validateBody, validateQuery } = require('../middleware/validate');
const courseController = require('../controllers/course.controller');
const { createCourseSchema, addStudentToCourseSchema, kickStudentFromCourseSchema, getCoursesForAdminSchema } = require('../validators/courses.validator');

const router = express.Router();



router.post('/create', auth(["admin"]), validateBody(createCourseSchema), courseController.createCourseForTeacher);

router.get('/get-courses-for-admin', auth(["admin"]), validateQuery(getCoursesForAdminSchema), courseController.getCoursesForAdmin);
router.get('/get-courses-for-teacher', auth(["teacher"]), validateQuery(getCoursesForAdminSchema), courseController.getCoursesForTeacher);
router.get('/get-courses-for-student', auth(["student"]), validateQuery(getCoursesForAdminSchema), courseController.getCoursesForStudent);

router.get('/get-course-users/:courseId', auth(["admin", "teacher"]), courseController.getCourseUsers);
router.post('/add-student', auth(["admin"]), validateBody(addStudentToCourseSchema), courseController.addStudentToCourseByEmail);
router.post('/kick-student', auth(["admin"]), validateBody(kickStudentFromCourseSchema), courseController.kickStudentFromCourseByEmail);

router.get("/course-detail/:courseId", auth(["admin", "teacher", "student"]), courseController.getCourseDetails);




module.exports = router;
