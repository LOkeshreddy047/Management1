const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9]+$/
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  dob: {
    type: Date,
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentYear: {
    type: Number,
    required: true,
    min: 2000,
    max: new Date().getFullYear()
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
