const throwError = require("../res/throwError");
const examService = require("../services/exam.service");
const handleRequest = require("./BaseController");

const examController = {
  // Public routes
  createExam: async (req, res) =>
    handleRequest(
      res,
      async () => {


        const examData = { ...req.body, creator: req.user.id };
        const createdExam = await examService.createExam(examData);
        return { examId: createdExam._id };
      },
      "Tạo bài kiểm tra thành công"
    ),
  getExams: async (req, res) =>
    handleRequest(
      res,
      async () => {
        const filters = {
          level: req.query.level,
          tags: req.query.tags,
          difficulty: req.query.difficulty,
          searchTerm: req.query.search,
        };
        return await examService.listAvailableExams(filters);
      },
      "Danh sách bài kiểm tra"
    ),

  getExamDetails: async (req, res) =>
    handleRequest(
      res,
      async () => {
        return await examService.getExamsById(req.params.exam_id);
      },
      "Chi tiết bài kiểm tra"
    ),

  // Protected routes for taking exam

  deleteExam: async (req, res) =>
    handleRequest(
      res,
      async () => {
        if (req.user.roles !== "admin" && req.user.roles !== "teacher") {
          throwError("Không có quyền xóa bài kiểm tra");
        }
        return await examService.deleteExam(req.params.id);
      },
      "Xóa bài kiểm tra thành công"
    ),
};

module.exports = examController;
