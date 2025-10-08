

const Lession = require("../models/Lesson.model");
const Course = require("../models/Course.model");
const User = require("../models/User.model");
const Enrollment = require("../models/Enrollment.model");

exports.createLesson = async (req, res) => {
    try {
        const { courseId, title, description, order, video_url, status } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.assignedTeacher.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the assigned teacher for this course' });
        }

        if (order != null) {
            const existing = await Lession.findOne({ course: courseId, order });
            if (existing) {
                return res.status(409).json({ message: 'A lesson with this order already exists in the course' });
            }
        }

        const lesson = await Lession.create({
            course: courseId,
            teacher: req.user.id,
            title,
            description,
            order,
            video_url,
            status
        });
        await Course.findByIdAndUpdate(courseId, { $inc: { 'stats.lessonCount': 1 } });
        res.status(201).json(lesson);
    } catch (error) {
        console.error("Error creating lesson:", error);
        if (error && (error.code === 11000 || error.name === 'MongoServerError')) {
            return res.status(409).json({
                message: 'Duplicate lesson order for this course',
                details: error.keyValue || null
            });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}


exports.deleteLesson = async (req, res) => {
    try {
        const lessonId = req.body.lessonId;
        const lesson = await Lession.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        if (lesson.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the assigned teacher for this lesson' });
        }
        await Lession.findByIdAndDelete(lessonId);
        await Course.findByIdAndUpdate(lesson.course, { $inc: { 'stats.lessonCount': -1 } });
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getLessonsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const lessons = await Lession.find({ course: courseId });
        res.status(200).json(lessons);
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getLessonById = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        console.log(lessonId);
        const lesson = await Lession.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        console.error("Error fetching lesson:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};