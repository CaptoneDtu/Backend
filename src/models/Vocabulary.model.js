const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const VocabularySchema = new Schema({
    hanzi: { type: String, required: true, trim: true, maxLength: 200 },
    pinyin: { type: String, required: true, trim: true, maxLength: 200 },
    meaning: { type: String, required: true, trim: true, maxLength: 500 },
    example: { type: String, trim: true, maxLength: 500 },
    level: { type: String, enum: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'], default: 'HSK1', index: true },

    course: { type: Types.ObjectId, ref: 'Course', required: true, index: true },
    lesson: { type: Types.ObjectId, ref: 'Lesson', index: true }, // optional
    createdBy: { type: Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

module.exports = model('Vocabulary', VocabularySchema);