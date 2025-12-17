const mongoose = require('../config/db')

const db = {}
db.mongoose = mongoose

db.User = require('./User.model')
db.Course = require('./Course.model')
db.Lesson = require('./Lesson.model')
db.Vocabulary = require('./Vocabulary.model')
db.Grammar = require('./Grammar.model')
db.Deck = require('./Deck.model')
db.FlashCard = require('./FlashCard.model')
db.Exam = require('./Exam.model')
db.ExamResult = require('./ExamResult.model')
db.Enrollment = require('./Enrollment.model')
db.Session = require('./Session.model')
db.Notification = require('./Notification.model')
db.NotificationRecipient = require('./NotificationRecipient.model')

console.log('📌 DB Models Loaded:', Object.keys(db))

module.exports = db
