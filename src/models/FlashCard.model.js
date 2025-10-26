const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const FlashCardSchema = new Schema({
    desk: { type: Types.ObjectId, ref: 'Desk', required: true, index: true },
    frontText: { type: String, required: true, trim: true, maxLength: 500 },
    backText: { type: String, required: true, trim: true, maxLength: 500 },
});

FlashCardSchema.index({ desk: 1, frontText: 1 }, { unique: true });

module.exports = model('FlashCard', FlashCardSchema);
