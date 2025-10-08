
const User = require("../models/User.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");





exports.createCourseForTeacher = async (req, res) => {
    try {
        const { title, assignedTeacher, ...rest } = req.body;

        const teacher = await User.findById(assignedTeacher).select('role');
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(400).json({ message: 'không tìm thấy teacher hoặc assignedTeacher phải là teacher' });
        }
        const doc = await Course.create({
            title,
            assignedTeacher,
            createdBy: req.user._id,
            ...rest
        });

        await doc.save();
        res.status(201).json(doc);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getCoursesForTeacher = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const courses = await Course.find({ assignedTeacher: req.user._id })
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getCoursesForStudent = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const userId = req.user.id;
        const enrollmentDocs = await Enrollment.find({ user: userId }).select('course');
        const courses = await Course.find({ _id: { $in: enrollmentDocs.map(doc => doc.course) } })
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('assignedTeacher', 'name email');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error("Error fetching course details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


exports.addStudentToCourseByEmail = async (req, res) => {
    try {
        const { studentEmail, courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const student = await User.findOne({ email: studentEmail, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or not a student role' });
        }
        const existingEnrollment = await Enrollment.findOne({ user: student._id, course: course._id });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Student already enrolled in this course' });
        }
        const doc = await Enrollment.create({ user: student._id, course: course._id });
        await doc.save();
        await Course.findByIdAndUpdate(course._id, { $inc: { "stats.enrolledCount": 1 } }).exec();
        res.status(200).json({ message: 'Student added to course successfully' , enrollment: doc });
    } catch (error) {
        console.error("Error adding student to course:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.kickStudentFromCourseByEmail = async (req, res) => {
    try {
        const { studentEmail, courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const student = await User.findOne({ email: studentEmail, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or not a student role' });
        }

        const deleted = await Enrollment.findOneAndDelete({ user: student._id, course: course._id });
        if (!deleted) {
            return res.status(400).json({ message: 'Student is not enrolled in this course' });
        }
        await Course.findByIdAndUpdate(course._id, { $inc: { "stats.enrolledCount": -1 } }).exec();
        res.status(200).json({ message: 'Student removed from course successfully' });
    } catch (error) {
        console.error("Error removing student from course:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};