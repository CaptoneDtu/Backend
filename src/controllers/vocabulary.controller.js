const Vocabulary = require('../models/Vocabulary.model');
const Course = require('../models/Course.model');
const Lesson = require('../models/Lesson.model');
const ApiRes = require('../res/apiRes');
const asyncHandler = require('../middleware/asyncHandler');
const { NotFoundError } = require('../res/AppError');
const { createVocabularySchema, updateVocabularySchema } = require('../validators/vocabulary.validator');

exports.createVocabulary = asyncHandler(async (req, res) => {
    const validatedData = createVocabularySchema.parse(req.body);
    const { chinese, pinyin, vietnamese, audioUrl, example, note, level, wordType, courseId, lessonId } = validatedData;
    
    if (courseId) {
        const course = await Course.findOne({ _id: courseId, assignedTeacher: req.user.id });
        if (!course) {
            throw new NotFoundError('Course not found or you do not have permission');
        }
    }
    
    if (lessonId) {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            throw new NotFoundError('Lesson not found');
        }
    }
    
    const newVocabulary = new Vocabulary({ 
        chinese, 
        pinyin, 
        vietnamese, 
        audioUrl,
        example,
        note,
        level,
        wordType,
        course: courseId,
        lesson: lessonId,
        createdBy: req.user.id 
    });
    await newVocabulary.save();
    
    return ApiRes.created(res, "Vocabulary created successfully", newVocabulary);
});

exports.getMyVocabularies = asyncHandler(async (req, res) => {
    const { level, wordType, page = 1, limit = 20 } = req.query;
    const filter = { createdBy: req.user.id };
    
    if (level) filter.level = level;
    if (wordType) filter.wordType = wordType;
    
    const skip = (page - 1) * limit;
    const vocabularies = await Vocabulary.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('course', 'title')
        .populate('lesson', 'title');
    
    const total = await Vocabulary.countDocuments(filter);
    
    return ApiRes.successWithMeta(res, "Vocabularies retrieved successfully", vocabularies, {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
    });
});

exports.updateVocabulary = asyncHandler(async (req, res) => {
    const { vocabularyId } = req.params;
    const validatedData = updateVocabularySchema.parse(req.body);
    
    const vocabulary = await Vocabulary.findOne({ _id: vocabularyId, createdBy: req.user.id });
    if (!vocabulary) {
        throw new NotFoundError('Vocabulary not found or you do not have permission');
    }
    
    if (validatedData.courseId) {
        const course = await Course.findOne({ _id: validatedData.courseId, assignedTeacher: req.user.id });
        if (!course) {
            throw new NotFoundError('Course not found or you do not have permission');
        }
        validatedData.course = validatedData.courseId;
        delete validatedData.courseId;
    }
    
    if (validatedData.lessonId) {
        const lesson = await Lesson.findById(validatedData.lessonId);
        if (!lesson) {
            throw new NotFoundError('Lesson not found');
        }
        validatedData.lesson = validatedData.lessonId;
        delete validatedData.lessonId;
    }
    
    Object.assign(vocabulary, validatedData);
    await vocabulary.save();
    
    return ApiRes.updated(res, "Vocabulary updated successfully", vocabulary);
});

exports.deleteVocabulary = asyncHandler(async (req, res) => {
    const { vocabularyId } = req.params;
    
    const vocabulary = await Vocabulary.findOneAndDelete({ _id: vocabularyId, createdBy: req.user.id });
    if (!vocabulary) {
        throw new NotFoundError('Vocabulary not found or you do not have permission');
    }
    
    return ApiRes.deleted(res, "Vocabulary deleted successfully");
});
