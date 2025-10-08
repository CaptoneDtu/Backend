const { z } = require('zod');

const createLessonSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "courseId must be a ObjectId"),
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(1000).optional(),
    order: z.number().min(1),
    video_url: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional()
});

const deleteLessonSchema = z.object({
    lessonId: z.string().regex(/^[0-9a-fA-F]{24}$/, "lessonId must be a ObjectId")
});

module.exports = {
    createLessonSchema,
    deleteLessonSchema
};
