const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Exam'
const COLLECTION_NAME = 'Exams'

/**
 * Schema cho câu hỏi trắc nghiệm
 */
const questionSchema = new Schema({
  id: { type: String, required: true }, // ID duy nhất cho câu hỏi
  type: {
    type: String,
    enum: ['multiple_choice', 'fill_in', 'ordering', 'listening', 'reading'],
    default: 'multiple_choice'
  },
  content: { type: String, required: true }, // Nội dung câu hỏi
  options: [{ text: String, id: String }], // Các lựa chọn cho câu hỏi trắc nghiệm
  correctAnswer: { type: String, required: true }, // Đáp án đúng
  point: { type: Number, default: 1 } // Điểm cho câu hỏi này
})

/**
 * Schema cho đề thi
 */
const examSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    time_limit: { type: Number, required: true }, // Thời gian làm bài (phút)
    total_points: { type: Number },
    level: {
      type: String,
      enum: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'Mixed'],
      required: true
    },
    sections: [
      {
        title: String,
        description: String,
        type: {
          type: String,
          enum: ['listening', 'reading', 'vocabulary', 'grammar']
        }
      }
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    tags: [String],
    questions: [
      {
        parentQuestion: { type: String },
        paragraph: { type: String },
        imgUrl: { type: String },
        audioUrl: { type: String },
        childQuestions: [questionSchema]
      }
    ],
    allowedTime: { type: Number }, // Thời gian cho phép làm bài (phút) - có thể khác với time_limit
    passingScore: { type: Number }, // Điểm đỗ
    allowedAttempts: { type: Number, default: 1 }, // Số lần được phép làm bài
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Danh sách user được phép làm bài (cho private exam)
    allowedGroups: [{ type: String }], // Danh sách nhóm được phép làm bài (cho group exam)
    startTime: { type: Date }, // Thời gian bắt đầu cho phép làm bài
    endTime: { type: Date }, // Thời gian kết thúc cho phép làm bài
    settings: {
      shuffleQuestions: { type: Boolean, default: false }, // Có xáo trộn câu hỏi không
      showResults: { type: Boolean, default: true }, // Có hiển thị kết quả ngay sau khi nộp bài không
      showAnswers: { type: Boolean, default: false }, // Có hiển thị đáp án đúng không
      preventCopy: { type: Boolean, default: false }, // Có ngăn copy nội dung không
      fullScreen: { type: Boolean, default: false } // Có bắt buộc chế độ toàn màn hình không
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

// Tạo index để tối ưu truy vấn
examSchema.index({ level: 1, tags: 1 })
examSchema.index({ creator: 1 })
examSchema.index({ course: 1 })

module.exports = model(DOCUMENT_NAME, examSchema)
