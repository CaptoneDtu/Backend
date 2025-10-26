
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const examplesSchema = new Schema({
    zh: { type: String, trim: true, maxLength: 500 },
    pinyin: { type: String, trim: true, maxLength: 500 },
    vi: { type: String, trim: true, maxLength: 500 },
});

const GrammarSchema = new Schema({
    title: { type: String, required: true, trim: true, maxLength: 200 },
    structure: { type: String, required: true, trim: true, maxLength: 1000 },
    examples: { type: [examplesSchema], default: [] },
    level: { type: String, enum: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'], default: 'HSK1', index: true },
    
    course: { type: Types.ObjectId, ref: 'Course', required: true, index: true },
    lesson: { type: Types.ObjectId, ref: 'Lesson', index: true }, // optional
    createdBy: { type: Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });



module.exports = model('Grammar', GrammarSchema);