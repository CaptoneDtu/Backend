
const { Schema, model, Types } = require("mongoose");

const contentsSchema = new Schema({
    grammar: { type: [Types.ObjectId], ref: 'Grammar', default: [] },
    vocabulary: { type: [Types.ObjectId], ref: 'Vocabulary', default: [] },
});

const LessonSchema = new Schema({
    course: { type: Types.ObjectId, ref: 'Course', required: true, index: true },
    teacher: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxLength: 200 },
    description: { type: String, default: '' },
    order: { type: Number, default: 1, min: 1, index: true },

    video_url: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft', index: true },

    contents: { type: contentsSchema, default: () => ({}) },
}, { timestamps: true });

LessonSchema.index({ course: 1, order: 1 }, { unique: true });
LessonSchema.index({ teacher: 1, course: 1 });


module.exports = model("Lesson", LessonSchema);