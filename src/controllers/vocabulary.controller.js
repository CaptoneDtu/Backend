const Vocabulary = require("../models/Vocabulary.model");
const Course = require("../models/Course.model");
const Lesson = require("../models/Lesson.model");
const ApiRes = require("../res/apiRes");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError } = require("../res/AppError");
const {
  createVocabularySchema,
  updateVocabularySchema,
} = require("../validators/vocabulary.validator");

exports.createVocabulary = asyncHandler(async (req, res) => {
  const { chinese, pinyin, vietnamese, example, level, wordType } = req.body;

  // A. Check trùng với từ hệ thống
  const existSystem = await Vocabulary.findOne({
    chinese,
    isSystem: true,
  });

  if (existSystem) {
    throw new Error("❌ Từ này đã có trong bộ từ vựng hệ thống");
  }

  // B. Check trùng với từ của teacher
  const existMine = await Vocabulary.findOne({
    chinese,
    createdBy: req.user.id,
  });

  if (existMine) {
    throw new Error("❌ Bạn đã thêm từ này trước đó");
  }

  const newVocabulary = await Vocabulary.create({
    chinese,
    pinyin,
    vietnamese,
    example,
    level,
    wordType,
    createdBy: req.user.id,
    isSystem: false,
  });

  return ApiRes.created(res, "Vocabulary created", newVocabulary);
});

exports.getMyVocabularies = asyncHandler(async (req, res) => {
  const { level, wordType } = req.query;

  const filter = {
    $or: [{ isSystem: true }, { createdBy: req.user.id }],
  };

  if (level) filter.level = level;
  if (wordType) filter.wordType = wordType;

  const vocab = await Vocabulary.find(filter).sort({ level: 1 });

  return ApiRes.success(res, "Vocabulary loaded", vocab);
});

exports.updateVocabulary = asyncHandler(async (req, res) => {
  const { vocabularyId } = req.params;
  const validatedData = updateVocabularySchema.parse(req.body);

  const vocabulary = await Vocabulary.findOne({
    _id: vocabularyId,
    createdBy: req.user.id,
  });
  if (!vocabulary) {
    throw new NotFoundError(
      "Vocabulary not found or you do not have permission"
    );
  }

  if (validatedData.courseId) {
    const course = await Course.findOne({
      _id: validatedData.courseId,
      assignedTeacher: req.user.id,
    });
    if (!course) {
      throw new NotFoundError("Course not found or you do not have permission");
    }
    validatedData.course = validatedData.courseId;
    delete validatedData.courseId;
  }

  if (validatedData.lessonId) {
    const lesson = await Lesson.findById(validatedData.lessonId);
    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }
    validatedData.lesson = validatedData.lessonId;
    delete validatedData.lessonId;
  }

  Object.assign(vocabulary, validatedData);
  await vocabulary.save();

  return ApiRes.updated(res, "Vocabulary updated successfully", vocabulary);
});

exports.getVocabularyById = asyncHandler(async (req, res) => {
  const { vocabularyId } = req.params;

  const vocabulary = await Vocabulary.findById(vocabularyId)
    .populate("course", "title targetLevel")
    .populate("lesson", "title order")
    .populate("createdBy", "fullName email")
    .lean();

  if (!vocabulary) {
    throw new NotFoundError("Vocabulary not found");
  }

  return ApiRes.success(res, "Vocabulary retrieved successfully", vocabulary);
});

exports.deleteVocabulary = asyncHandler(async (req, res) => {
  const { vocabularyId } = req.params;

  const vocabulary = await Vocabulary.findOneAndDelete({
    _id: vocabularyId,
    createdBy: req.user.id,
  });
  if (!vocabulary) {
    throw new NotFoundError(
      "Vocabulary not found or you do not have permission"
    );
  }

  return ApiRes.deleted(res, "Vocabulary deleted successfully");
});

exports.getStudentVocabularies = asyncHandler(async (req, res) => {
  const {
    level,
    wordType,
    courseId,
    lessonId,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};

  if (level) filter.level = level;
  if (wordType) filter.wordType = wordType;
  if (courseId) filter.course = courseId;
  if (lessonId) filter.lesson = lessonId;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [vocabularies, total] = await Promise.all([
    Vocabulary.find(filter)
      .sort({ createdAt: 1 }) // cho học sinh thì sort tăng dần (có thể chỉnh)
      .skip(skip)
      .limit(limitNum)
      .populate("course", "title")
      .populate("lesson", "title"),
    Vocabulary.countDocuments(filter),
  ]);

  return ApiRes.successWithMeta(
    res,
    "Student vocabularies retrieved successfully",
    vocabularies,
    {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      itemsPerPage: limitNum,
    }
  );
});
