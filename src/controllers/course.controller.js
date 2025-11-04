
const User = require("../models/User.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");
const Lesson = require("../models/Lesson.model");

const ApiRes = require("../res/apiRes");

exports.getCoursesForAdmin = async (req, res) => {
    const { title, page, limit, targetLevel, status } = req.query;

    const filter = {};
    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }
    if (targetLevel) {
        filter.targetLevel = targetLevel;
    }
    if (status) {
        filter.status = status;
    }
    const skip = (page - 1) * limit;
    const courses = await Course.find(filter)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));

    return ApiRes.success(res, "Courses retrieved successfully", courses);

}

exports.getCoursesForTeacher = async (req, res) => {
    const { title, page, limit, targetLevel, status } = req.query;
    const filter = { assignedTeacher: req.user.id };
    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }
    if (targetLevel) {
        filter.targetLevel = targetLevel;
    }
    if (status) {
        filter.status = status;
    }
    const skip = (page - 1) * limit;
    const courses = await Course.find(filter)
        .populate('assignedTeacher', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));
    return ApiRes.success(res, "Courses retrieved successfully", courses);
}



exports.getCoursesForStudent = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id;
    const enrollmentDocs = await Enrollment.find({ user: userId }).select('course');
    const courses = await Course.find({ _id: { $in: enrollmentDocs.map(doc => doc.course) } })
        .populate('assignedTeacher', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));
    return ApiRes.success(res, "Courses retrieved successfully", courses);
}

exports.getCourseUsers = async (req, res) => {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId }).populate('user', 'name email role');
    const users = enrollments.map(enrollment => enrollment.user);
    return ApiRes.success(res, "Course users retrieved successfully", users);
}

exports.getCourseDetails = async (req, res) => {
    const { courseId } = req.params;
    const user = req.user;
    if (user.role === 'student') {
        const enrollment = await Enrollment.findOne({ course: courseId, user: user.id });
        if (!enrollment) {
            return ApiRes.error(res, "You are not enrolled in this course", 403);
        }
    }

    const course = await Course.findById(courseId).populate('assignedTeacher', 'name email');
    if (!course) {
        return ApiRes.error(res, "Course not found", 404);
    }

    if (user.role === 'teacher') {
        if (!course || course.assignedTeacher.toString() !== user.id) {
            return ApiRes.error(res, "You do not have access to this course", 403);
        }
    }
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
    return ApiRes.success(res, "Course details retrieved successfully", { course, lessons });
}


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
        res.status(200).json({ message: 'Student added to course successfully', enrollment: doc });
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