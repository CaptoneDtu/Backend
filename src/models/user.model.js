const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String, 
      required: true,
      select: false // tránh trả về trong query mặc định
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'blocked'],
      default: 'pending'
    },
    date_of_birth: {
      type: Date,
      default: null
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other'
    },
    avatar: {
      type: String,
      default: ''
    },
    roles: {
      type: String,
      // enum: ['student', 'teacher', 'admin'],
      default: 'student'
      // required: true
    },
    phone: {
      type: String,
      default: ''
    },

    // 👨‍🏫 Dành riêng cho giáo viên
    teacher_profile: {
      bio: { type: String, default: '' },
      experience_years: { type: Number, default: 0 },
      subjects: [{ type: String }],
      certificates: [{ type: String }]
    },

    // 🎓 Dành cho học sinh
    student_profile: {
      enrolled_courses: [{ type: Types.ObjectId, ref: 'Course' }],
      learning_level: { type: String, default: 'beginner' },
      progress: { type: Number, default: 0 }
    },

    // 👮‍♂️ Dành cho admin
    admin_profile: {
      permissions: [{ type: String }],
      last_login_ip: { type: String },
      managed_users: [{ type: Types.ObjectId, ref: 'User' }]
    },

    // 📍 Tracking
    last_login_at: { type: Date },
    last_active_at: { type: Date },

    // 🔒 Bảo mật
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
    two_factor_enabled: { type: Boolean, default: false },
    two_factor_secret: { type: String }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

module.exports = model(DOCUMENT_NAME, userSchema)
