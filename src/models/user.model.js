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
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student'
      
    },
    phone: {
      type: String,
      default: ''
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

module.exports = model(DOCUMENT_NAME, userSchema)
